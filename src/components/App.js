import React, { useEffect, useState } from "react";
import { Grid, Segment, Container, Button, Input } from "semantic-ui-react";
import "../styles/Styles.css";
import Meme from "./Meme";
import MemeList from "./MemeList";
import { GeneratedMeme } from "./GeneratedMeme";
import axios from "axios";
import "../styles/Styles.css";

import { useHistory, Switch, Route } from "react-router-dom";

const App = () => {
  const [memes, setMemes] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState({
    url: "https://i.imgflip.com/ljk.jpg",
    box_count: 0,
  });

  const download = (e) => {
    fetch(generated.url, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${selectedMeme.name}.jpg`); //or any other extension
          document.body.appendChild(link);
          link.click();
          history.push("/");
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let arr = Array(selectedMeme.box_count)
      .fill(" ")
      .map((e, i) => {
        if (captions && captions[i]) {
          return captions[i];
        }
        return e;
      });
    setCaptions(arr);
  }, [memes, selectedMeme]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await axios
        .get("https://api.imgflip.com/get_memes", {})
        .then(function (response) {
          const memes = response.data.data.memes;
          setMemes(memes);
        })
        .catch(function (error) {
          console.log("There was an error getting memes");
        });
    })();
  }, []);

  const generateMeme = () => {
    const formData = new FormData();
    formData.append("username", process.env.REACT_APP_USERNAME);
    formData.append("password", process.env.REACT_APP_PASSWORD);
    formData.append("template_id", selectedMeme.id);
    captions.forEach((caption, index) => {
      formData.append(`boxes[${index}][text]`, caption);
    });
    axios({
      method: "post",
      url: "https://api.imgflip.com/caption_image",
      data: formData,
    })
      .then((response) => {
        setGenerated(response.data.data);
        history.push(`generated?url=${response.data.data.url}`);
      })
      .catch(function (error) {
        console.log("There was an error captioning your meme");
      });
  };

  function onMemeSelect(meme) {
    history.push(`/`);
    setSelectedMeme(meme);
  }

  function updateCaption(e, index) {
    const text = e.target.value || "";
    setCaptions(
      captions.map((c, i) => {
        if (index === i) {
          return text;
        } else {
          return c;
        }
      })
    );
  }

  function hasCaptions() {
    let caps = true;
    captions.forEach((cap) => {
      console.log(cap);
      if (!isEmpty(cap)) {
        caps = false;
      }
    });
    return caps;
  }

  function isEmpty(str) {
    if (str == null || str.trim().length == 0) {
      return true;
    }
    return false;
  }

  return (
    <Container className="app" textAlign="center">
      <HeaderSection />
      <Grid columns="equal">
        <Grid.Column>
          <Segment>
            <Switch>
              <Route exact path="/">
                <Meme meme={selectedMeme} />
              </Route>
              <Route path="/generated">
                <GeneratedMeme />
                <Segment vertical>
                  <Button
                    className="padding-top"
                    size="huge"
                    onClick={(e) => download(selectedMeme)}
                  >
                    {" "}
                    Download Meme
                  </Button>
                </Segment>
              </Route>
            </Switch>
          </Segment>
        </Grid.Column>
        <Grid.Column width={5}>
          <Segment vertical>
            <p className="same-line">
              Please choose a meme before writing the captions and clicking
              generate.{" "}
            </p>{" "}
            <MemeList onMemeSelect={onMemeSelect} memes={memes} />
          </Segment>
          <div className="ui text container segment">
            {captions.map((caption, index) => (
              <Segment key={index}>
                <Input
                  onChange={(e) => updateCaption(e, index)}
                  key={index}
                  type="text"
                  placeholder="Meme text"
                />
              </Segment>
            ))}
            <Button
              // disabled={captions.length == 1 && captions[0] == " "}
              disabled={hasCaptions()}
              onClick={generateMeme}
              className="same-line"
            >
              Generate Meme
            </Button>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

function HeaderSection() {
  return (
    <div className="ui raised very padded text container segment">
      <h2 className="ui header">Meme Generator</h2>
      <p>
        {" "}
        Click which meme you want to use and fill in the appropriate captions.
        If you don't like any of them, you can regenerate by clicking the "Show
        me more memes" button. Happy creating!
      </p>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";
import FormInput from "./Utils/FormInput.js";
import TextArea from "./Utils/TextArea.js";
import { UserContext } from "./Context/AuthenticatedContext";

function NewPost() {
  const { user } = React.useContext(UserContext);

  const [article, setArticle] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });

  const [submitError, setSubmitError] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      article,
    };
    let tags = article.tagList;
    payload.article.tagList = tags.split(/\W+/g);

    console.log(payload);

    try {
      const result = await axios.post(
        "https://conduit.productionready.io/api/articles",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user.token}`,
          },
        }
      );

      console.log(payload.article, result);
      setArticle({
        title: "",
        description: "",
        body: "",
        tagList: "",
      });
    } catch (error) {
      console.log(error.response.data.errors);
      let errorNames = Object.keys(error.response.data.errors);
      let errorObject = {
        title: "",
        description: "",
        body: "",
        tagList: "",
      };
      errorNames.forEach(
        (name) => (errorObject[name] = error.response.data.errors[name][0])
      );
      console.log(errorObject);
      setSubmitError(errorObject);
    }
  };

  const handleSubmitError = (name) => {
    if (submitError.hasOwnProperty("title") && name === "title") {
      return submitError.title;
    }
    if (submitError.hasOwnProperty("description") && name === "description") {
      return submitError.description;
    }
    if (submitError.hasOwnProperty("body") && name === "body") {
      return submitError.body;
    }
  };

  const handleChange = (event) => {
    setArticle({ ...article, [event.target.name]: event.target.value });
    setSubmitError({ ...submitError, [event.target.name]: "" });
  };

  return (
    <div className="newPost">
      <main>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Title"
            name="title"
            type="text"
            placeholder="Article Title"
            required={true}
            minLength={4}
            onValueChange={handleChange}
            value={article.title}
            submitError={handleSubmitError("title")}
          />
          <FormInput
            label="About"
            name="description"
            type="text"
            placeholder="What is this article about?"
            required={true}
            onValueChange={handleChange}
            value={article.description}
            submitError={handleSubmitError("description")}
          />
          <TextArea
            label="Content"
            name="body"
            required={true}
            rows={5}
            onValueChange={handleChange}
            value={article.body}
            submitError={handleSubmitError("body")}
          />
          <FormInput
            label="TagList"
            name="tagList"
            type="text"
            onValueChange={handleChange}
            value={article.tagList}
          />
          <button type="submit">Publish Article</button>
        </form>
      </main>
    </div>
  );
}

export default NewPost;

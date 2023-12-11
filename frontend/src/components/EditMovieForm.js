import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import InputLabel from "@mui/material/InputLabel";

const EditMovieForm = ({ onEdit, toggleForm, movieProps }) => {
  const [movieId, setMovieId] = useState("");
  const [title, setTitle] = useState("");
  const [imdb, setImdb] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [helperText, setHelperText] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id: movieProps.id,
      title: title ? title : movieProps.title,
      imdb: imdb ? imdb : movieProps.imdb,
      image: image ? image : movieProps.image,
      rating: rating ? rating : movieProps.rating,
      count: count ? count : movieProps.count,
    };

    const res = await onEdit(data);

    // if ("err" in res) {
    //   console.log("ERROR");
    // }

    setHelperText("");
    setMovieId("");
    setTitle("");
    setImdb("");
    setImage("");
    setRating(0);
    setCount(0);
    toggleForm();
  };

  return (
    <div>
      <form>
        <Dialog open={true} onClose={toggleForm}>
          <DialogTitle>Edit Movie</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              defaultValue={movieProps.title}
              variant="standard"
              autoComplete="off"
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="imdb"
              label="Imdb link"
              type="text"
              fullWidth
              defaultValue={movieProps.imdb}
              variant="standard"
              autoComplete="off"
              required={true}
              onChange={(e) => setImdb(e.target.value)}
            />
            <TextField
              margin="dense"
              id="image"
              label="Image link"
              type="text"
              fullWidth
              defaultValue={movieProps.image}
              variant="standard"
              autoComplete="off"
              onChange={(e) => setImage(e.target.value)}
            />
            <InputLabel required sx={{ marginTop: 2 }}>
              Rating
            </InputLabel>
            <Rating
              max={10}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <br />
            <TextField
              InputProps={{ inputProps: { min: 0 } }}
              min="0"
              margin="dense"
              variant="standard"
              id="count"
              label="Number of ratings"
              type="number"
              defaultValue={movieProps.count}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onSubmit}>Save</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default EditMovieForm;

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

const AddMovie = ({ onAdd, toggleForm }) => {
  const [title, setTitle] = useState("");
  const [imdb, setImdb] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(0);
  // const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [helperText, setHelperText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    if (title === "" || imdb === "" || rating === 0) {
      setHelperText("Please fill out the required fields");
    } else {
      onAdd({ title, imdb, image, rating });

      setHelperText("");
      setTitle("");
      setImdb("");
      setImage("");
      setRating(0);
      toggleForm();
    }
  };

  return (
    <div>
      <form>
        <Dialog open={true} onClose={toggleForm}>
          <DialogTitle>Add movie</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              autoComplete="off"
              required={true}
              helperText={title ? "" : helperText}
              error={helperText.length > 0}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              id="imdb"
              label="Imdb link"
              type="text"
              fullWidth
              variant="standard"
              autoComplete="off"
              required={true}
              helperText={imdb ? "" : helperText}
              error={helperText.length > 0}
              onChange={(e) => setImdb(e.target.value)}
            />
            <TextField
              margin="dense"
              id="image"
              label="Image link"
              type="text"
              fullWidth
              variant="standard"
              autoComplete="off"
              onChange={(e) => setImage(e.target.value)}
            />
            <InputLabel
              required
              error={helperText.length > 0}
              sx={{ marginTop: 2 }}
            >
              Rating
            </InputLabel>
            <Rating max={10} onChange={(e) => setRating(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={onSubmit}>Add</Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default AddMovie;

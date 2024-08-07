let url = "https://cloudrun-maze-backend-6opp6q3ena-lz.a.run.app/v1";
if (process.env.NODE_ENV === "development") {
  url = "http://localhost:8080/v1";
}

export const helperFunctions = {
  // Get all movies from the database
  fetchMovies: async () => {
    return await fetch(`${url}/movies`).then((response) => response.json());
  },
  // Add movie to the database
  addMovie: async (movie) => {
    const data = {
      title: movie.title,
      imdb: movie.imdb,
      image: movie.image ? movie.image : "",
      rating: parseInt(movie.rating),
    };

    await fetch(`${url}/movies/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return error;
      });
  },

  editMovie: async (data) => {
    return await fetch(`${url}/movies/edit`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => {
        return error;
      });
  },
  // Delete movie from database
  deleteMovie: async (id) => {
    const data = {
      id: id,
    };

    return await fetch(`${url}/movies/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => {
        return error;
      });
  },
  // rate a single movie
  rateMovie: async (data) => {
    await fetch(`${url}/movies/rate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return error;
      });
  },
  // Register a new user
  registerUser: async (user) => {
    const data = {
      email: user.email,
      password: user.password,
    };

    return await fetch(`${url}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return error;
      });
  },
  // Log in user
  login: async (user) => {
    const data = {
      email: user.email,
      password: user.password,
    };

    return await fetch(`${url}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // if (data.email) {
        //   localStorage.setItem("user", data.email);
        //   localStorage.setItem("isAuthenticated", true);
        // }
        return data;
      })
      .catch((error) => {
        return error;
      });
  },
  // Log out user. Removes cookie with token
  logout: async () => {
    return await fetch(`${url}/users/logout`, {
      method: "POST",
      credentials: "include",
    }).then((response) => response.json());
  },
  // admin: async () => {
  //   return await fetch(`${url}/admin`, {
  //     method: "GET",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Success: ", data);
  //       return data;
  //     })
  //     .catch((error) => {
  //       console.error("Error: ", error);
  //     });
  // },
  pageViews: async (data) => {
    await fetch(`${url}/pageviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success: ", data);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  },
};

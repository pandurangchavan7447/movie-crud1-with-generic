console.log("JavaScript file is connected!");
const cl = console.log;

// ===============================
// DOM REFERENCES
// ===============================

const movies_container = document.getElementById("movies_container");
const title_control = document.getElementById("title_control");
const desc_control = document.getElementById("desc_control");
const poster_control = document.getElementById("poster_control");
const rating_control = document.getElementById("rating_control");
const genre_control = document.getElementById("genre_control");

const backdrop = document.getElementById("backdrop");
const movimodel = document.getElementById("movimodel");
const movie_form = document.getElementById("movie_form");
const add_btn = document.getElementById("add_btn");
const update_btn = document.getElementById("update_btn");
const form_heading = document.getElementById("form_heading");
const spinner = document.getElementById("spinner");

const showmoviemodel = document.querySelectorAll(".showmoviemodel");

// ===============================
// STATE
// ===============================

const state = {
  moviesArr: [],
  edit_id: null,
};

// ===============================
// FIREBASE REALTIME DATABASE
// ===============================

const base_url = "https://movie-crud-generic-default-rtdb.firebaseio.com";
const movies_url = `${base_url}/movies.json`;

// ===============================
// MODAL
// ===============================

showmoviemodel.forEach((element) => {
  element.addEventListener("click", ontoggle);
});

function ontoggle() {
  backdrop.classList.toggle("active");
  movimodel.classList.toggle("active");
  movie_form.reset();

  form_heading.innerText = "Add Movie Form";
  add_btn.classList.remove("d-none");
  update_btn.classList.add("d-none");
  state.edit_id = null;
}

// ===============================
// SPINNER
// ===============================

function spinnerhandel(flag = false) {
  if (flag) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
}

// ===============================
// FETCH HELPER
// ===============================

function makeApicall(url, methodname, body = null) {
  const options = {
    method: methodname,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    return res.json();
  });
}

// ===============================
// FIREBASE OBJECT -> ARRAY
// ===============================

function nestedobjtoArr(obj) {
  state.moviesArr = [];

  if (!obj) {
    return;
  }

  for (const key in obj) {
    state.moviesArr.unshift({
      id: key,
      ...obj[key],
    });
  }
}

// ===============================
// RATING BADGE
// ===============================

function setrating(rat) {
  const rating = Number(rat);

  if (rating >= 8 && rating <= 10) {
    return "badge-success";
  }

  if (rating >= 5 && rating < 8) {
    return "badge-warning";
  }

  return "badge-danger";
}

// ===============================
// SWEET ALERT
// ===============================

function snackbar(titletext, Icon) {
  Swal.fire({
    title: titletext,
    icon: Icon,
    draggable: true,
    timer: 2000,
    showConfirmButton: false,
  });
}

// ===============================
// READ ALL MOVIES
// ===============================

function fetchmovies() {
  spinnerhandel(true);

  makeApicall(movies_url, "GET")
    .then((data) => {
      nestedobjtoArr(data);
      onread(state.moviesArr);
    })
    .catch((err) => {
      cl(err);
      snackbar("Unable to fetch movies", "error");
    })
    .finally(() => {
      spinnerhandel(false);
    });
}

// ===============================
// DISPLAY MOVIES
// ===============================

function onread(arr) {
  let result = "";

  arr.forEach((movi) => {
    result += `
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4 movie-col" id="${movi.id}">
        <div class="card h-100 moviecard">
          <div class="card-header">
            <div class="row d-flex justify-content-between">
              <div class="col-10">
                <h4 class="mb-0 movietitle">${movi.title}</h4>
                <small>
                  Created At: ${new Date(movi.createAt).toLocaleString("en-IN")}
                </small>
              </div>

              <div class="col-2">
                <h4 class="mb-0">
                  <span class="badge ${setrating(movi.rating)}">${movi.rating}</span>
                </h4>
              </div>
            </div>
          </div>

          <div class="card-body py-0">
            <figure>
              <img src="${movi.poster}" title="${movi.title}" alt="${movi.title}" />
              <figcaption>
                <h4>${movi.title}</h4>
                <p>${movi.description}</p>
                <p><strong>Genre:</strong> ${movi.genre}</p>
              </figcaption>
            </figure>
          </div>

          <div class="card-footer">
            ${
              movi.updatedAt
                ? `<small>Updated At: ${new Date(movi.updatedAt).toLocaleString("en-IN")}</small>`
                : ""
            }

            <div class="mt-2 d-flex justify-content-between">
              <button onclick="onedithand(this)" class="btn btn-info" type="button">
                Edit
              </button>
              <button onclick="ondeletehand(this)" class="btn btn-danger" type="button">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  movies_container.innerHTML = result;
}

// ===============================
// CREATE MOVIE
// ===============================

function oncreate(eve) {
  eve.preventDefault();
  spinnerhandel(true);

  const newmovi_obj = {
    title: title_control.value.trim(),
    createAt: Date.now(),
    rating: Number(rating_control.value),
    poster: poster_control.value.trim(),
    description: desc_control.value.trim(),
    updatedAt: null,
    genre: genre_control.value,
  };

  makeApicall(movies_url, "POST", newmovi_obj)
    .then((data) => {
      newmovi_obj.id = data.name;
      state.moviesArr.unshift(newmovi_obj);
      onread(state.moviesArr);

      snackbar(`Movie with id ${data.name} added successfully`, "success");
      ontoggle();
    })
    .catch((err) => {
      cl(err);
      snackbar("Unable to add movie", "error");
    })
    .finally(() => {
      spinnerhandel(false);
    });
}

// ===============================
// DELETE MOVIE
// ===============================

function ondeletehand(ele) {
  Swal.fire({
    title: "Are you sure?",
    text: "You want to delete this movie!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "rgb(13, 202, 240)",
    cancelButtonColor: "rgb(220, 53, 69)",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (!result.isConfirmed) return;

    spinnerhandel(true);

    const dlt_id = ele.closest(".movie-col").id;
    const dlt_url = `${base_url}/movies/${dlt_id}.json`;

    makeApicall(dlt_url, "DELETE")
      .then(() => {
        const findidx = state.moviesArr.findIndex(
          (movie) => movie.id === dlt_id
        );

        if (findidx !== -1) {
          state.moviesArr.splice(findidx, 1);
        }

        ele.closest(".movie-col").remove();
        snackbar(`Movie with id ${dlt_id} deleted`, "success");
      })
      .catch((err) => {
        cl(err);
        snackbar("Unable to delete movie", "error");
      })
      .finally(() => {
        spinnerhandel(false);
      });
  });
}

// ===============================
// LOAD MOVIE FOR EDIT
// ===============================

function onedithand(ele) {
  spinnerhandel(true);

  const edit_id = ele.closest(".movie-col").id;
  state.edit_id = edit_id;

  const edit_url = `${base_url}/movies/${edit_id}.json`;

  makeApicall(edit_url, "GET")
    .then((data) => {
      title_control.value = data.title || "";
      rating_control.value = data.rating || 1;
      poster_control.value = data.poster || "";
      desc_control.value = data.description || "";
      genre_control.value = data.genre || "";

      form_heading.innerText = "Update Movie";
      add_btn.classList.add("d-none");
      update_btn.classList.remove("d-none");

      backdrop.classList.add("active");
      movimodel.classList.add("active");
    })
    .catch((err) => {
      cl(err);
      snackbar("Unable to load movie", "error");
    })
    .finally(() => {
      spinnerhandel(false);
    });
}

// ===============================
// UPDATE MOVIE
// ===============================

function onupdatehand() {
  spinnerhandel(true);

  const update_id = state.edit_id;

  if (!update_id) {
    spinnerhandel(false);
    snackbar("No movie selected for update", "error");
    return;
  }

  const old_obj = state.moviesArr.find(
    (movie) => movie.id === update_id
  );

  if (!old_obj) {
    spinnerhandel(false);
    snackbar("Movie not found", "error");
    return;
  }

  const updated_obj = {
    title: title_control.value.trim(),
    createAt: old_obj.createAt,
    rating: Number(rating_control.value),
    poster: poster_control.value.trim(),
    description: desc_control.value.trim(),
    updatedAt: Date.now(),
    genre: genre_control.value,
  };

  const update_url = `${base_url}/movies/${update_id}.json`;

  makeApicall(update_url, "PATCH", updated_obj)
    .then(() => {
      const findidx = state.moviesArr.findIndex(
        (movie) => movie.id === update_id
      );

      updated_obj.id = update_id;
      state.moviesArr[findidx] = updated_obj;

      onread(state.moviesArr);
      snackbar(`Movie with id ${update_id} updated successfully`, "success");
    })
    .catch((err) => {
      cl(err);
      snackbar("Unable to update movie", "error");
    })
    .finally(() => {
      spinnerhandel(false);
      ontoggle();
    });
}

// ===============================
// EVENT LISTENERS
// ===============================

update_btn.addEventListener("click", onupdatehand);
movie_form.addEventListener("submit", oncreate);

// ===============================
// START APP
// ===============================

fetchmovies();

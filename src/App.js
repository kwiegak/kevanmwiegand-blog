import React, { useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import AboutPage from "./components/about/AboutPage";
import Header from "./components/common/Header";
import PageNotFound from "./components/PageNotFound";
import PhotosPage from "./components/photos/PhotosPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    debugger;
    await Promise.all(notesFromAPI.map(async note => {
    //  if (note.image) {
        const image = await Storage.get("poop.PNG");
        note.image = image;
        apiData.data.listNotes.items[0].image = image;
        apiData.data.listNotes.items[1].image = image;        
    //  }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } }});
  }

  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }  

  return (
    
    <div className="App">
          <div className="container-fluid">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/photos" component={PhotosPage} />
        <Route path="/about" component={AboutPage} />
        <Route component={PageNotFound} />
      </Switch>
      <ToastContainer autoClose={3000} hideProgressBar />
    </div>
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
      {
  notes.map(note => (
    <div key={note.id || note.name}>
      <h2>{note.name}</h2>
      <p>{note.description}</p>
      <button onClick={() => deleteNote(note)}>Delete note</button>
      {
        note.image && <img src={note.image} style={{width: 400}} />
      }
    </div>
  ))
}
      </div>
      <input type="file" onChange={onChange}/>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
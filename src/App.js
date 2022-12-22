import { db } from './firebaseConnection'
import './app.css'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  async function buscarPost() {
    const postRef = doc(db, "posts", "duWBJFpmHHO46B8jkbrB")

    await getDoc(postRef)
      .then((snapshot) => {
        setAutor(snapshot.data().autor);
        setTitulo(snapshot.data().titulo);
      })
      .catch((error) => {
        console.log("Erro ao buscar " + error);
      })
  }

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("Dados registrado no banco");
    //   })
    //   .catch((error) => {
    //     console.log("Gerou erro " + error);
    //   })

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Cadastrado som sucesso");
        setAutor('');
        setTitulo('');
      })
      .catch((error) => {
        console.log("Erro ao cadastrar " + error);
      })
  }
  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      <div className="container">
        <label>Titulo: </label>
        <textarea
          type="text"
          placeholder='Digite o titulo'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input
          type="text"
          placeholder='Autor do post'
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}> Cadastrar </button>
        <button onClick={buscarPost}> Buscar Post</button>
      </div>
    </div>
  );
}

export default App;

import { db } from './firebaseConnection'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore'

import './app.css'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [posts, setPosts] = useState([]);

  async function buscarPost() {
    // const postRef = doc(db, "posts", "duWBJFpmHHO46B8jkbrB")

    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch((error) => {
    //     console.log("Erro ao buscar " + error);
    //   })

    const postsRef = collection(db, "posts");

    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(lista);
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

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>Título: {post.titulo} </span><br />
                <span>Autor: {post.autor} </span><br /><br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;

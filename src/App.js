import { db } from './firebaseConnection'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'

import './app.css'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');

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

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log("Post atualizado");
        setIdPost('');
        setTitulo('');
        setAutor('');
      })
      .catch((error) => {
        console.log("Erro ao atualizar o post: " + error);
      })
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);

    await deleteDoc(docRef)
      .then(() => {
        alert("Post deletado com Sucesso");
        buscarPost();
      })

      .catch((error) => {
        console.log("Erro ao deletar post" + error);
      })




  }


  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      <div className="container">
        <label>ID do Post</label>
        <input
          placeholder='Digite o ID do post'
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

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
        <button onClick={editarPost}>Atualizar </button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong> {post.id} </strong><br />
                <span>Título: {post.titulo} </span><br />
                <span>Autor: {post.autor} </span><br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;

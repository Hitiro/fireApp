import { db, auth } from './firebaseConnection'
import { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import './app.css'

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(listaPost);
      })
    }

    loadPosts();
  }, [])

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
        // buscarPost();
      })

      .catch((error) => {
        console.log("Erro ao deletar post" + error);
      })

  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        console.log("Usuario cadastrado com suucesso!")
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert("Senha muito fraca");
        } else if (error.code === 'auth/email-already-in-use') {
          alert("E-mail já cadastrado")
        } else if (error.code === 'auth/invalid-email') {
          alert("E-mail inválido");
        }
        console.log("Erro ao cadastrar usuário: " + error)
      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("Login efetuado com sucesso!" + value)
        console.log(value.user);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        })

        setUser(true);

        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          alert("E-mail ou senha inválidos");
        }
        console.log(error)
      })
  }

  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }


  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      {user && (
        <div>
          <strong> Seja bem-vindo(a) (Você está logado!)</strong> <br />
          <span>ID: {userDetail.uid} - E-mail: {userDetail.email} </span>
          <button onClick={fazerLogout}>Sair</button>
          <br /><br />
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>
        <label>E-Mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um e-mail"
        /><br />

        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite a sua senha"
        /><br />


        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>



      </div>

      <br /><br />

      <hr />

      <div className="container">
        <h2>Posts</h2>
        <label>ID do Post</label>
        <input
          placeholder='Digite o ID do post'
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        /><br />

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
                <br /><br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;

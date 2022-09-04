import { Todo } from "../../utils/types";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Home.module.css";

interface ShowProps {
  todo: Todo;
  url: string;
}

function Show(props: ShowProps) {
  // get the next route,r so we can use router.push later
  const router = useRouter();

  // set the todo as state for modifiation
  const [todo, setTodo] = useState<Todo>(props.todo);

  // function to complete a todo
  const handleComplete = async () => {
    if (!todo.completed) {
      const newTodo: Todo = {
        ...todo,
        completed: true,
      };

      await fetch(props.url + "/" + todo._id, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      setTodo(newTodo);
    }
  };

  const handleDelete = async () => {
    await fetch(props.url + "/" + todo._id, {
      method: "delete",
    });

    router.push("/");
  };

  //return JSX
  return (
    <div className={styles.maincont}>
      <div className={styles.newtodo}>
        <h3>{todo.item}</h3>
        <h4>{todo.completed ? "completed" : "incomplete"}</h4>
        <button onClick={handleComplete}>Complete</button>
        <button onClick={handleDelete}>Delete</button>
        <button
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

// Define Server Side Props
export async function getServerSideProps(context: any) {
  // fetch the todo, the param was received via context.query.id
  const res = await fetch(process.env.API_URL + "/" + context.query.id);
  const todo = await res.json();

  //return the serverSideProps the todo and the url from out env variables for frontend api calls
  return { props: { todo, url: process.env.API_URL } };
}

// export component
export default Show;

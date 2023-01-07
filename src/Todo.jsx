import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Todo.css";
function Todo() {
  useEffect(() => {
    // console.log("Called");
    //Promise
    axios
      .get("/api/data")
      .then((res) => {
        // console.log(res.data.data);
        setTasks(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const PROGRESS = "progress";
  const COMPLETE = "complete";
  const [text, setText] = useState(``);
  const [tasks, setTasks] = useState([]);

  const handleDelete = (id, index) => {
    console.log(id);
    axios
      .delete(`/api/delete?id=${id}`)
      .then((response) => {
        console.log(id);
        const value = [...tasks];
        value.splice(index, 1);
        setTasks(value);

        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSetText = (e) => {
    setText(e.target.value);
  };

  const handleChangeStatus = (index, mode, id) => {
    const currentState = mode === "yes" ? COMPLETE : PROGRESS;
    axios
      .put("/api/update", { status: currentState, id })
      .then((response) => {
        console.log(response);
        const value2 = [...tasks];
        value2[index].status = currentState;
        setTasks(value2);
      })
      .catch((e) => console.log(e));
    // console.log({ status: currentState, id });
  };

  const handleCreateTask = () => {
    if (text.length === 0) {
      alert("Cannot Create Empty task.");
    } else {
      const obj = { name: text, status: PROGRESS };
      axios
        .post("/api/create", obj)
        .then((response) => {
          const value = [...tasks];
          value.unshift(obj);
          setTasks(value);
          setText("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <div className="outerDiv">
      <input
        type="text"
        className="inputBox"
        placeholder="Enter any task"
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateTask();
          }
        }}
        onChange={handleSetText}
      />
      <button
        className="inputBox"
        style={{ cursor: "pointer" }}
        onClick={handleCreateTask}
      >
        +
      </button>
      {tasks.map((value, index) => {
        // console.log(value);
        return (
          <div
            className="task"
            key={index}
            style={{
              backgroundColor:
                value.status === PROGRESS ? "lightblue" : "lightcoral",
            }}
          >
            {value.status === PROGRESS ? (
              <div className="singleTask">{value.name}</div>
            ) : (
              <strike className="singleTask">{value.name}</strike>
            )}
            <button
              className="dustbin"
              onClick={() => handleDelete(value.id, index)}
            >
              🥫
            </button>

            {value.status === PROGRESS ? (
              <button
                className="yes"
                onClick={() => handleChangeStatus(index, `yes`, value.id)}
              >
                ✔
              </button>
            ) : (
              <button
                className="no"
                onClick={() => handleChangeStatus(index, "no", value.id)}
              >
                ❌
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Todo;

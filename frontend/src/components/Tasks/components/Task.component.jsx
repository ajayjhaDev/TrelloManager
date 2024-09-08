import React from 'react';
import { useDrag } from 'react-dnd';
import moment from 'moment';
import "./style.css"

const Task = ({ task, handleDelete, handleEdit ,handleViewDetails}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task._id, status: task.status},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      className="task_content"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div>
        <h3>{task.title}</h3>
        <p className="task_description">{task.desc}</p>
      </div>
      <div className="task_description">
        Created at : {moment(task.createdAt).format('DD/MM/YYYY, HH:MM:SS')}
      </div>
      <div className="btn_container">
        <button
          className="fun_btn"
          onClick={() => handleDelete(task._id)}
          style={{ cursor: 'pointer' }}
        >
          Delete
        </button>
        <button
          className="fun_btn light_blue"
          style={{ cursor: 'pointer' }}
          onClick={() => handleEdit(task)}
        >
          Edit
        </button>
        <button
          className="fun_btn blue"
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewDetails(task)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Task;

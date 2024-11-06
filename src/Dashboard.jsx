import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Dashboard = () => {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <p>Please login to view the dashboard. </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('inserted_at', { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error.message);
      } else {
        setTodos(data || []);
      }
      setLoading(false);
    };

    fetchTodos();
  }, [user.id]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (newTodo.trim()) {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            task: newTodo,
            user_id: user.id,
            is_complete: false,
          }
        ])
        .select();

      if (error) {
        alert("Error adding todo: " + error.message);
      } else {
        setTodos([data[0], ...todos]);
        setNewTodo('');
      } 
    }
  };

  const toggleTodoCompletion = async (todoId, currentStatus) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ is_complete: !currentStatus })
      .eq('id', todoId);

    if (error) {
      alert("Error updating todo status: " + error.message);
    } else {
      setTodos(todos.map(todo =>
        todo.id === todoId ? { ...todo, is_complete: !currentStatus } : todo
      ));
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.task);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();

    if (newTodo.trim() && editingTodo) {
      const { data, error } = await supabase
        .from('todos')
        .update({ task: newTodo })
        .eq('id', editingTodo.id);

      if (error) {
        alert("Error updating todo: " + error.message);
      } else {
        setTodos(todos.map(todo => 
          todo.id === editingTodo.id ? { ...todo, task: newTodo } : todo
        ));
        setNewTodo('');
        setEditingTodo(null);
      }
    }
  };

  const deleteTodo = async (todoId) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);

    if (error) {
      alert("Error deleting todo: " + error.message);
    } else {
      setTodos(todos.filter(todo => todo.id !== todoId));
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Error logging out: " + error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mt-5">
      <div className='d-flex justify-content-between'>
      <h3>Welcome <span className='display-5'>{user.email.split('@')[0].split('.')[0]}</span></h3>
      <button onClick={handleLogout} className="btn btn-outline-danger mb-4">
        Log Out
      </button>

      </div>
      <hr />
      


      <form onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo} className="mb-4">
        <div className="input-group mt-5">
          <input
            type="text"
            className="form-control"
            placeholder={editingTodo ? "Update your todo..." : "Add a new todo..."}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">
            {editingTodo ? 'Update Todo' : 'Add Todo'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className='mt-5 display-6'>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className='mt-5 display-6'>No todos yet! Add some todos.</p>
      ) : (
        <>
        <h4 className='mt-5 display-6'>Your Todos</h4>
        <ul className="list-group  m-5 fs-4">
          {todos.map((todo) => (
            <li key={todo.id} className={`list-group-item d-flex justify-content-between align-items-center p-3 ${todo.is_complete ? 'list-group-item-success' : 'list-group-item-info'}`}>
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={todo.is_complete}
                  onChange={() => toggleTodoCompletion(todo.id, todo.is_complete)}
                  className="me-2"
                />
                <span> {todo.task} </span>
              </div>

              <div className="btn-group">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => startEditing(todo)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;

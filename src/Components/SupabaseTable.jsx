import React, { useState, useEffect } from 'react';
import Supabase from './Supabase';

function SupabaseTable() {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        class: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await Supabase.from('users').select('*');

            if (error) {
                console.error(error);
            } else {
                setData(data);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const openStudentForm = () => {
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
    };


    const handleAddStudent = async () => {
        // Send new student data to Supabase
        const { data: newData, error } = await Supabase
            .from('users')
            .insert([{ name: formData.name, class: parseInt(formData.class) }]);

        if (error) {
            alert('Error adding student: ' + error.message);
        } else {
            // Update the local table data with new student
            setData([...data, newData[0]]);
            closeForm();
            // Reset form data
            setFormData({ name: '', class: '' });
        }
    };

    const handleDelete = async (id) => {
        const { error } = await Supabase.from('users').delete().eq('id', id);

        if (error) {
            alert('Error deleting student: ' + error.message);
        } else {
            setData(data.filter((item) => item.id !== id));
        }
    };

    const handleEdit = (student) => {
        setFormData({ name: student.name, class: student.class });
        setEditId(student.id);
        setIsEditMode(true);
        setShowForm(true);
    };

    const handleUpdateStudent = async () => {
        const { error } = await Supabase
            .from('users')
            .update({ name: formData.name, class: parseInt(formData.class) })
            .eq('id', editId);
        console.log(formData.name, formData.class, editId);
        if (error) {
            alert('Error updating student: ' + error.message);
        } else {
            // Refresh local data
            const updatedData = data.map((item) =>
                item.id === editId ? { ...item, ...formData } : item
            );
            setData(updatedData);

            // Reset states
            setEditId(null);
            setIsEditMode(false);
            setFormData({ name: '', class: '' });
            closeForm();
        }
    };

    return (
        <>
            <div className="App">
                <h1>Student Data Table</h1>

                {/* Add Student Button */}
                <button onClick={isEditMode ? handleUpdateStudent : openStudentForm}>
                    {isEditMode ? 'Update a Student Data' : 'Add a Student Data'}
                </button>

                {/* Table */}
                {data.length > 0 ? (
                    <table border="1" cellPadding="10" cellSpacing="0" style={{ marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Created At</th>
                                <th>Delete</th>
                                <th>Update</th>

                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.class}</td>
                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleDelete(item.id)}>❌</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(item)}> ✏️</button>
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Loading data...</p>
                )}

                {/* Popup form */}
                {showForm && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            padding: '20px',
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
                            zIndex: 1000,
                        }}
                    >
                        <h2>Add New Student</h2>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Class:</label>
                            <input
                                type="number"
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={isEditMode ? handleUpdateStudent : handleAddStudent}
                            > {isEditMode ? 'Update' : 'Add'}</button>


                            <button onClick={() => {
                                closeForm();
                                setIsEditMode(false);
                            }} style={{ marginLeft: '10px' }}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Optional: overlay background */}
                {showForm && (
                    <div
                        onClick={closeForm}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            zIndex: 999,
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default SupabaseTable;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [animals, setAnimals] = useState([]);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // เปลี่ยน BASE_URL ให้ชี้ไปที่ Backend ที่ Deploy บน Vercel
  const BASE_URL = 'https://my-express-app-bay.vercel.app/api';

  // ฟังก์ชันดึงข้อมูลสัตว์จาก API
  const fetchAnimals = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/animals`);
      setAnimals(response.data);
      setMessage('โหลดข้อมูลสำเร็จ');
      setError('');
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลได้');
      setMessage('');
      console.error('Error fetching animals:', error.message);
    }
  };

  // ฟังก์ชันเพิ่มสัตว์ใหม่
  const addAnimal = async (e) => {
    e.preventDefault();
    try {
      const newAnimal = { name, species };
      const response = await axios.post(`${BASE_URL}/animals`, newAnimal);
      setMessage(`เพิ่มสัตว์: ${response.data.animal.name} สำเร็จ`);
      setError('');
      fetchAnimals();
      setName('');
      setSpecies('');
    } catch (error) {
      setError('ไม่สามารถเพิ่มข้อมูลได้');
      setMessage('');
      console.error('Error adding animal:', error.message);
    }
  };

  // ฟังก์ชันลบสัตว์
  const deleteAnimal = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/animals/${id}`);
      setMessage('ลบข้อมูลสำเร็จ');
      setError('');
      fetchAnimals();
    } catch (error) {
      setError('ไม่สามารถลบข้อมูลได้');
      setMessage('');
      console.error('Error deleting animal:', error.message);
    }
  };

  // ดึงข้อมูลเมื่อ Component ถูกโหลดครั้งแรก
  useEffect(() => {
    fetchAnimals();
  }, []);

  return (
    <div className="App">
      <header>
        <h1>รายชื่อสัตว์</h1>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
      <main>
        {/* ฟอร์มเพิ่มสัตว์ */}
        <form onSubmit={addAnimal}>
          <input
            type="text"
            placeholder="ชื่อสัตว์"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="สายพันธุ์"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          />
          <button type="submit">เพิ่มข้อมูล</button>
        </form>

        {/* ตารางแสดงข้อมูลสัตว์ */}
        <table>
          <thead>
            <tr>
              <th>ชื่อสัตว์</th>
              <th>สายพันธุ์</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {animals.map((animal) => (
              <tr key={animal._id}>
                <td>{animal.name}</td>
                <td>{animal.species}</td>
                <td>
                  <button onClick={() => deleteAnimal(animal._id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;

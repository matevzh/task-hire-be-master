 // Ce je podan idKategorija v URL, se prikazejo samo taski iz te kategorije
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, Task } from '../services/api';
import { Card, Row, Col } from 'react-bootstrap';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const kategorijaId = searchParams.get('kategorija');

  // Pridobivanje taskov na prvi prikaz in ko se kategorija spremeni
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Pridobi ali filtrirane taske po kategoriji ali vse taske
        const tasksData = kategorijaId 
          ? await api.getFilteredTasks(parseInt(kategorijaId))
          : await api.getTasks();
        setTasks(tasksData);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [kategorijaId]);

  if (loading) {
    return <div className="container">Loading tasks...</div>;
  }

  return (
    <div className="container">
      <h1>Tasks</h1>
      {kategorijaId && <p>Showing tasks for selected category</p>}
      
      <Row className="mt-4">
        {tasks.map((task) => (
          <Col key={task.id} xs={12} md={6} lg={4} className="mb-3">
            <Card 
              className="h-100 cursor-pointer" 
              style={{ 
                cursor: 'pointer',
                backgroundColor: '#198754',
                color: 'white'
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <h3 className="mb-0">{task.title}</h3>
                <p className="mb-0">{task.description}</p>
                <p className="mb-0">
                  <small>
                    Category: {task.kategorija?.title}
                  </small>
                </p>
                <p className="mb-0">
                  <strong>Price: ${task.cena}</strong>
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Tasks; 
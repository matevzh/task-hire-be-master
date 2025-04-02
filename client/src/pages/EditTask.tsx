import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Task, Kategorija } from '../services/api';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<Kategorija[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cena: 0,
    kategorijaId: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [taskData, categoriesData] = await Promise.all([
          api.getTask(parseInt(id!)),
          api.getCategories()
        ]);
        setTask(taskData);
        setCategories(categoriesData);
        setFormData({
          title: taskData.title,
          description: taskData.description,
          cena: taskData.cena,
          kategorijaId: taskData.kategorija?.id || 0
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        cena: parseFloat(formData.cena.toString())
      };
      await api.updateTask(parseInt(id!), updateData);
      navigate('/profile');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cena' ? parseFloat(value) : 
              name === 'kategorijaId' ? parseInt(value, 10) : 
              value
    }));
  };

  if (loading) {
    return <div className="container text-center mt-5">Loading...</div>;
  }

  if (!task) {
    return <div className="container text-center mt-5">Task not found</div>;
  }

  return (
    <Container style={{ maxWidth: '600px' }} className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Edit Task</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="kategorijaId"
                value={formData.kategorijaId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => navigate('/profile')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditTask; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { api, Kategorija } from '../services/api';
// import { useAuth } from '../context/AuthContext';

const NewTask = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [categories, setCategories] = useState<Kategorija[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cena: '',
    kategorijaId: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createTask({
        ...formData,
        cena: parseFloat(formData.cena),
        kategorijaId: parseInt(formData.kategorijaId)
      });
      navigate('/profile');
    } catch (error) {
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Container className="mt-5 pt-5">
      <Card>
        <Card.Body>
          <h2 className="mb-4">Create New Task</h2>
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
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
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
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="success" type="submit">
              Create Task
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NewTask; 
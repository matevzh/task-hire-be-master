import { useEffect, useState } from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { api, Kategorija } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [categories, setCategories] = useState<Kategorija[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

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

  const renderCategoryButtons = () => {
    if (loading) {
      return <div>Loading categories...</div>;
    }

    return (
      <Row className="mt-4">
        {categories.map((category) => (
          <Col key={category.id} xs={12} sm={6} md={4} className="mb-3">
            <Card 
              className="h-100 cursor-pointer" 
              onClick={() => navigate(`/tasks?kategorija=${category.id}`)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: '#198754',
                color: 'white',
                minHeight: '140px',
                transition: 'transform 0.2s ease'
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-3">
                <h4 className="mb-0 text-center" style={{ 
                  fontSize: '1.4rem',
                  lineHeight: '1.3',
                  wordBreak: 'break-word',
                  hyphens: 'auto'
                }}>
                  {category.title}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="container">
      <div className="mb-4">
        {!isAuthenticated && <h1>Welcome to TaskHire</h1>}
        {isAuthenticated ? (
          <>
            <h2>Welcome back, {user?.firstName || 'User'}!</h2>
            <p>Manage your tasks and explore</p>
          </>
        ) : (
          <>
            <p>Connect with freelancers and get your tasks done.</p>
            <div className="mt-3">
              <Button variant="success" className="me-3" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outline-success" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="mt-5">
        <h2>Browse Tasks by Category</h2>
        {renderCategoryButtons()}
      </div>
    </div>
  );
};

export default Home; 
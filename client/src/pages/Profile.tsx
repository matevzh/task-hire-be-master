 // Potrebuje avtentikacijo za dostop
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Task, User } from '../services/api';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // Pridobi podatke uporabnika in naloži taskoe na prvi prikaz
  useEffect(() => {
    // Preusmeri na login, ce ni avtentikiran
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userData, tasksData] = await Promise.all([
          api.getUserProfile(),
          api.getUserTasks()
        ]);
        setUser(userData);
        setUserTasks(tasksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditTask = (taskId: number) => {
    navigate(`/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(taskId);
        setUserTasks(userTasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return <div className="container text-center mt-5">Loading profile...</div>;
  }

  if (!user) {
    return <div className="container text-center mt-5">User not found</div>;
  }

  return (
    <Container style={{ maxWidth: '800px' }} className="py-5">
      {/* User Profile Card */}
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card className="border-0">
            <Card.Body className="text-center">
              <img
                src={user.avatar || '/profile.png'}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h3 className="mb-2">{user.firstName} {user.lastName}</h3>
              <p className="text-muted mb-2">@{user.username}</p>
              <p className="text-muted mb-3">{user.email}</p>
              <Button 
                variant="danger" 
                onClick={handleLogout}
                size="sm"
                className="px-4"
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Tasks */}
      <Row className="mt-5">
        <Col xs={12}>
          <h4 className="mb-4">My Tasks</h4>
          {userTasks.length === 0 ? (
            <p className="text-muted text-center">No tasks yet</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {userTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className="border-0 shadow-sm hover-shadow"
                  style={{
                    transition: 'all 0.3s ease',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px'
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="mb-0">{task.title}</h5>
                      <strong className="text-primary">${task.cena}</strong>
                    </div>
                    <p className="text-muted mb-2">{task.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Category: {task.kategorija?.title}
                      </small>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditTask(task.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { FaSearch, FaArrowLeft, FaArrowRight, FaCalculator } from 'react-icons/fa';
import mockApiResponse from './mock-response.json';
import { fetchFood, fetchTypes } from '../api/ApiClient';
import DataTable from '../components/DataTable';
import LocationSelector from '../components/LocationSelector';
import DateTimePicker from '../components/DateTimePicker';

const DecisionSupportPage = () => {
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [foodTypes, setFoodTypes] = useState([]); 
  const [location, setLocation] = useState({ lat: 21.00669167077796, lng: 105.8542 });
  const [foods, setFoods] = useState([]);
  const [selectedDate, setDate] = useState(new Date());
  const [apiResponse, setApiResponse] = useState([]);

  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem('userLocation'));

    if (savedLocation) {
      setLocation(savedLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          localStorage.setItem('userLocation', JSON.stringify(userLocation)); 
        },
        (error) => {
          console.error(error);
          toast.error('Không thể lấy vị trí hiện tại');
        }
      );
    } else {
      toast.error('Trình duyệt của bạn không hỗ trợ Geolocation');
    }

    const getFoodTypes = async () => {
      try {
        const data = await fetchTypes();
        setFoodTypes(data); 
      } catch (error) {
        toast.error('Không thể tải danh sách loại đồ ăn.');
      }
    };

    getFoodTypes();
  }, []);

  const handleFoodTypeToggle = (foodType) => {
    setSelectedFoodTypes(prev =>
      prev.includes(foodType)
        ? prev.filter(f => f !== foodType)
        : [...prev, foodType]
    );
  };

  const fetchDataDemo = () => {
    setTimeout(() => {
      setSteps(apiResponse);
      const firstStepKey = Object.keys(apiResponse)[0];
      setCurrentStep(firstStepKey);
    }, 300);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedFoodTypes.length === 0) {
        toast.error('Vui lòng chọn ít nhất một loại đồ ăn');
        return;
      }
      if (priceMin > priceMax) {
        toast.error('Khoảng giá không hợp lệ!');
        return;
      }
      const { lat, lng } = location;

      const response = await fetchFood(
        formatTime(), 
        selectedFoodTypes.join(','), 
        calories,
        lat, 
        lng,
        priceMin, 
        priceMax 
      );
      setFoods(response[5].rows.slice(0, 40));
      setApiResponse(response);
      setCurrentStep(null); 
      toast.info("Tải dữ liệu thành công!")
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error(error);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    try {
      if (selectedFoodTypes.length === 0) {
        toast.error('Vui lòng chọn ít nhất một loại đồ ăn');
        return;
      }
      if (priceMin > priceMax) {
        toast.error('Khoảng giá không hợp lệ!');
        return;
      }
      // setFoods([])
      fetchDataDemo();
      return;
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error(error);
    }
  };

  const handleNextStep = () => {
    if (!steps || !currentStep) return;

    const stepKeys = Object.keys(steps);
    const currentIndex = stepKeys.indexOf(currentStep);

    if (currentIndex < stepKeys.length - 1) {
      setCurrentStep(stepKeys[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (!steps || !currentStep) return;

    const stepKeys = Object.keys(steps);
    const currentIndex = stepKeys.indexOf(currentStep);

    if (currentIndex > 0) {
      setCurrentStep(stepKeys[currentIndex - 1]);
    }
  };

  const formatTime = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    const dayOfWeek = selectedDate.getDay(); // Get day of week (0-6)
    const hour = selectedDate.getHours(); // Get hour (0-23)
    const minute = selectedDate.getMinutes(); // Get minute (0-59)
  
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
  
    // Chuyển đổi day từ 0-6 thành 1-7 (Sunday = 0 => day = 7)
    const formattedDay = (dayOfWeek === 0 ? 7 : dayOfWeek);
  
    return `${formattedDay}-${hour}:${formattedMinute}`;
  };
  
  return (
    <div className="py-4 px-5 container-fluid">
      <Container className='py-2'>
      <Card className="shadow-sm mb-4">
        <Card.Header as="h2" className="text-white text-center" style={{ backgroundColor: "#faac64" }}>
          Hệ thống trợ giúp chọn món ăn
        </Card.Header>

        <Card.Body>
        <Form onSubmit={(e) => handleSubmit(e)}> {/* Mặc định là tìm kiếm */}
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Khung Giá (VNĐ)</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Từ"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      min="0"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Đến"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      min="0"
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Lượng Calo</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Nhập lượng calo"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  min="0"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Loại Đồ Ăn (*)</Form.Label>
                <Row>
                  {foodTypes.map((foodType) => (
                    <Col xs={6} md={4} key={foodType.id}>
                      <Form.Check
                        type="checkbox"
                        id={`food-type-${foodType.id}`}
                        label={foodType.description}
                        checked={selectedFoodTypes.includes(foodType.id)}
                        onChange={() => handleFoodTypeToggle(foodType.id)}
                        className="d-inline-block w-100"
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
              <Form.Group style={{ marginTop: '0.6rem' }}>
                <Form.Label>Thời gian</Form.Label>
                <Row>
                  <DateTimePicker dateTime={selectedDate} setDateTime={setDate}/>
                </Row>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mt-4">
                <Form.Label>Chọn vị trí</Form.Label>
                <LocationSelector location={location} setLocation={setLocation} />
          </Form.Group>
          <div className="d-flex justify-content-center mt-3">
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-2 me-2 btn-info"
            >
              <FaSearch className="me-2" />
              Tìm Kiếm
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2 btn-info"
              onClick={(e) => handleCalculate(e)} 
            >
              <FaCalculator className="me-2" />
              Tính Toán
            </Button>
          </div>
        </Form>
        </Card.Body>
      </Card>
      </Container>
      {currentStep && (
        <Card className="shadow-sm mb-5"> 
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0" style={{ color: "darkred" }}>
              {
                currentStep === "0" 
                  ? "Dữ liệu ban đầu trong Database"
                  : currentStep === "1"
                  ? "Dữ liệu đã kết hợp với input user"
                  : `Tính toán theo TOPSIS - Bước tính toán thứ ${parseInt(currentStep) + 1}`
              }
            </h4>
            <div>
              <Button
                variant="outline-secondary"
                className="btn-info me-2"
                disabled={currentStep === Object.keys(steps)[0]}
                onClick={handlePrevStep}
              >
                <FaArrowLeft />
              </Button>
              <Button
                variant="outline-secondary"
                className="btn-info"
                disabled={currentStep === Object.keys(steps)[Object.keys(steps).length - 1]}
                onClick={handleNextStep}
              >
                <FaArrowRight />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
               <DataTable data={steps[currentStep]?.rows || []} />
            </div>
          </Card.Body>

        </Card>
      )}
     {foods.length > 0 && (
        <Container>
          <Row>
            {foods.map((food, index) => (
              <Col key={index} xs={12} md={4} lg={3} className="mb-4 d-flex">
                <Card className="h-100">
                  <Card.Img variant="top" src={food.image} className="card-img" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{food.name}</Card.Title>
                    <Card.Text>{food.description}</Card.Text>
                    <div className="d-flex justify-content-between mt-auto">
                      <span style={{color:"darkred"}}>Giá: {food.original_price} VNĐ</span>
                      <span style={{color:"blue"}}>Calo: {food.original_calo}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DecisionSupportPage;

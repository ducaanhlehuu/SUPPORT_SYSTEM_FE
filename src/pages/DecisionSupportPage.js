import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const FOOD_TYPES = [
  { name: 'Đồ Nướng', code: 'grilled' },
  { name: 'Đồ Chiên', code: 'fried' },
  { name: 'Salad', code: 'salad' },
  { name: 'Đồ Hàn', code: 'korean' },
  { name: 'Đồ Tây', code: 'western' },
  { name: 'Đồ Việt', code: 'vietnamese' },
  { name: 'Đồ Nhật', code: 'japanese' },
  { name: 'Đồ Chay', code: 'vegetarian' }
];

const mockApiResponse = {
  "0": {
    "rows": [
      { "col1": "data", "col2": "data", "col3": "data" }
    ]
  },
  "1": {
    "rows": [
      { "col1": "data", "col2": "data", "col3": "data" }
    ]
  }
};

const DecisionSupportPage = () => {
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [calories, setCalories] = useState('');
  const [steps, setSteps] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  

  const handleFoodTypeToggle = (foodType) => {
    setSelectedFoodTypes(prev => 
      prev.includes(foodType) 
        ? prev.filter(f => f !== foodType)
        : [...prev, foodType]
    );
  };
  
  const fetchDataDemo = () => {
    setTimeout(() => {
      setSteps(mockApiResponse);
      const firstStepKey = Object.keys(mockApiResponse)[0];
      setCurrentStep(firstStepKey);
    }, 1000);
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

      fetchDataDemo();
      return; 

      // const payload = {
      //   priceMin: priceMin ? parseInt(priceMin) : 0,
      //   priceMax: priceMax ? parseInt(priceMax) : null,
      //   foodTypes: selectedFoodTypes,
      //   calories: calories ? parseInt(calories) : null
      // };

      // const response = await axios.post('/api/decision-support', payload);
      
      // setSteps(response.data);
      
      // const firstStepKey = Object.keys(response.data)[0];
      // setCurrentStep(firstStepKey);
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

  return (
    <Container className="py-4">
      <Card className="shadow-sm mb-4">
      <Card.Header as="h2" className="text-white text-center" style={{ backgroundColor: "#faac64" }}>
        Hệ thống trợ giúp chọn món ăn
      </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
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
                <Form.Group className='mt-4'>
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
                    {FOOD_TYPES.map((foodType) => (
                      <Col xs={6} md={4} key={foodType.code}>
                        <Form.Check 
                          type="checkbox"
                          id={`food-type-${foodType.code}`}
                          label={foodType.name}
                          checked={selectedFoodTypes.includes(foodType.code)}
                          onChange={() => handleFoodTypeToggle(foodType.code)}
                          className="d-inline-block w-100"
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-3">
              <Button 
                type="submit" 
                variant="primary" 
                className="px-4 py-2 btn-info"
              >
                <FaSearch className="me-2" />
                Tìm Kiếm
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {currentStep && (
        <Card className="shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0" style={{color:"darkred"}}>Bước tính toán thứ {parseInt(currentStep) + 1}</h4>
            <div>
              <Button 
                variant="outline-secondary" 
                className='btn-info me-2'
                disabled={currentStep === Object.keys(steps)[0]}
                onClick={handlePrevStep}
              >
                <FaArrowLeft />
              </Button>
              <Button 
                variant="outline-secondary"
                className='btn-info'
                disabled={currentStep === Object.keys(steps)[Object.keys(steps).length - 1]}
                onClick={handleNextStep}
              >
                <FaArrowRight />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  {steps[currentStep]?.rows?.[0] && (
                    <tr>
                      {Object.keys(steps[currentStep].rows[0]).map((colName, index) => (
                        <th key={index} className="center-align">{colName.toUpperCase()}</th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {steps[currentStep]?.rows?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex} className="center-align">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default DecisionSupportPage;

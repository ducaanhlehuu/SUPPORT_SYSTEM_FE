import React from "react";
import { Table } from "react-bootstrap";

const DataTable = ({ data }) => {
  const headers = [
    { key: "stt", label: "STT", width: "50px" },
    { key: "name", label: "Tên món", width: "200px" },
    { key: "description", label: "Mô tả", width: "100px" },
    { key: "original_price", label: "Giá gốc", width: "100px" },
    { key: "original_calo", label: "Calo gốc", width: "100px" },
    { key: "original_rating", label: "Đánh giá gốc", width: "100px" },
    { key: "distance", label: "Khoảng cách", width: "100px" },
    { key: "processed_price", label: "Giá xử lý", width: "100px" },
    { key: "processed_calo", label: "Calo xử lý", width: "100px" },
    { key: "processed_rating", label: "Đánh giá xử lý", width: "100px" },
    { key: "total_like", label: "Tổng yêu thích", width: "100px" },
    { key: "restaurant_name", label: "Tên nhà hàng", width: "250px" },
    { key: "restaurant_total_review", label: "Tổng đánh giá", width: "150px" },
    { key: "restaurant_avg_rating", label: "Đánh giá trung bình", width: "150px" },
  ];

  // Hàm để kiểm tra và làm tròn số
  const formatValue = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2); // Làm tròn đến 2 chữ số
    }
    return value; // Giữ nguyên nếu không phải số
  };

  return (
    <div
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        border: "1px solid #dee2e6", 
      }}
    >
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                style={{
                  width: header.width,
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  textAlign: "center",
                }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={{ textAlign: "center" }}>
                  {header.key === "stt"
                    ? rowIndex + 1
                    : formatValue(item[header.key] || "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;

import React, { useState } from "react";
import { Table, Pagination } from "react-bootstrap";

const DataTable = ({ data }) => {
  const headers = [
    { key: "stt", label: "STT", width: "50px" },
    { key: "name", label: "Tên món", width: "200px" },
    // { key: "description", label: "Mô tả", width: "100px" },
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Xác định dữ liệu của trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Tổng số trang
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Hàm để kiểm tra và làm tròn số
  const formatValue = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2); // Làm tròn đến 2 chữ số
    }
    return value; // Giữ nguyên nếu không phải số
  };

  // Hàm xử lý chuyển trang
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div
        style={{
          maxWidth: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          overflowX: "auto",
          border: "1px solid #dee2e6",
        }}
      >
        <Table striped bordered hover responsive style={{ minWidth: "1200px" }}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    width: header.width,
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    textAlign: "center",
                  }}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex} style={{
                    width: header.width,
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                    textAlign: "center",
                  }}>
                    {header.key === "stt"
                      ? indexOfFirstItem + rowIndex + 1
                      : formatValue(item[header.key] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        />
        <Pagination.Item active>
          Trang {currentPage} / {totalPages}
        </Pagination.Item>
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default DataTable;

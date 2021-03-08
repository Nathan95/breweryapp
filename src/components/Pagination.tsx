import React from "react";
import '../css/Pagination.css';

interface Props {
  ordersPerPage: any
  ordersAmount: any;
  paginate: any
}

const Pagination: React.FC<Props> = ({ordersPerPage, ordersAmount, paginate}) => {
  
  const pageNumbers = [];

  for (let i = 1; i < Math.ceil(ordersAmount / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="paginationContainer">
      <nav>
        <ul className="pagination">
          <span>Page</span>
          {pageNumbers.map(number => {
            return (
              <li className="page-item" key={number}>
                <a
                  href="!#"
                  data-testid={`page ${1}`}
                  onClick={e => {
                    paginate(number);
                    e.preventDefault();
                  }}
                  className="page-link"
                >
                  {number}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;

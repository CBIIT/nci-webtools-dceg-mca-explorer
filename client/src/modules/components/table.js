import { useMemo } from "react";
import BootstrapTable from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Pagination from "react-bootstrap/Pagination";
import { useTable, useFilters, usePagination, useSortBy } from "react-table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export function TextFilter({ column: { filterValue, setFilter, placeholder, aria } }) {
  return (
    <Form.Control
      value={filterValue || ""}
      onBlur={(e) => setFilter(e.target.value || undefined)}
      placeholder={placeholder || `Search...`}
      aria-label={aria}
    />
  );
}

export function RangeFilter({ column: { filterValue = [], setFilter, minPlaceholder, maxPlaceholder, aria } }) {
  const getInputValue = (ev) => (ev.target.value ? parseInt(ev.target.value, 10) : undefined);

  return (
    <InputGroup className="flex-nowrap">
      <Form.Control
        placeholder={minPlaceholder || "Min value"}
        type="number"
        value={filterValue[0] || ""}
        onBlur={(e) => setFilter((old = []) => [getInputValue(e), old[1]])}
        aria-label={aria + " Min"}
      />
      <Form.Control
        placeholder={maxPlaceholder || "Max value"}
        type="number"
        value={filterValue[1] || ""}
        onBlur={(e) => setFilter((old = []) => [old[0], getInputValue(e)])}
        aria-label={aria + " Max"}
      />
    </InputGroup>
  );
}

export default function Table({ columns, data, options, defaultSort }) {
  data.sort((a, b) => (a.name > b.name ? 1 : -1));
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,

    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: useMemo((_) => columns, [columns]),
      data: useMemo((_) => data, [data]),
      initialState: {
        sortBy: defaultSort,
      },
      ...options,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="table-responsive">
        <BootstrapTable responsive {...getTableProps()} striped hover>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      whiteSpace: column.id === "pValue" ? "nowrap" : "normal",

                      fontSize: "14px",
                    }}>
                    {column.render("Header")}{" "}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <i className="bi bi-sort-down text-primary ml-1" />
                      ) : (
                        <i className="bi bi-sort-up text-primary ml-1" />
                      )
                    ) : (
                      ""
                    )}
                  </th>
                ))}
              </tr>
            ))}
            {/*headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <td {...column.getHeaderProps()}>
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </td>
                ))}
              </tr>
                ))*/}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td style={{ whiteSpace: "nowrap" }} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </BootstrapTable>
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between px-3" style={{ fontSize: "14px" }}>
        <div>
          Showing rows {(1 + pageIndex * pageSize).toLocaleString()}-
          {Math.min(rows.length, (pageIndex + 1) * pageSize).toLocaleString()} of {rows.length.toLocaleString()}
        </div>

        <div className="d-flex" style={{ paddingTop: 10, fontSize: "14px" }}>
          <Form.Control
            style={{ fontSize: "14px" }}
            as="select"
            className="mr-2"
            name="select-page-size"
            aria-label="Select page size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}>
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Control>

          <Pagination className="mb-0">
            <Pagination.First
              href={`#/`}
              onClick={(e) => {
                e.preventDefault();
                gotoPage(0);
              }}
              disabled={!canPreviousPage}
              style={{ fontSize: "14px" }}>
              First
            </Pagination.First>
            <Pagination.Prev
              href={`#/`}
              onClick={(e) => {
                e.preventDefault();
                previousPage();
              }}
              disabled={!canPreviousPage}
              style={{ fontSize: "14px" }}>
              Previous
            </Pagination.Prev>
            <Pagination.Next
              href={`#/`}
              onClick={(e) => {
                e.preventDefault();
                nextPage();
              }}
              disabled={!canNextPage}>
              Next
            </Pagination.Next>
            <Pagination.Last
              href={`#/`}
              onClick={(e) => {
                e.preventDefault();
                gotoPage(pageCount - 1);
              }}
              disabled={!canNextPage}>
              Last
            </Pagination.Last>
          </Pagination>
        </div>
      </div>
    </>
  );
}

import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import axiosMock from "axios";
import Brewerlist from "../components/Brewerlist";
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { fixtures } from './data'; 
import { ohio } from './ohioData'; 
import { act } from "react-dom/test-utils";

afterEach(cleanup);

jest.mock("axios");

const data = fixtures;

const loadingUrl = "https://api.openbrewerydb.org/breweries?per_page=50";
const searchUrl = "https://api.openbrewerydb.org/breweries?per_page=50&by_state=ohio";

it("lands on the page and displays data", async () => {
  act(() => {
    axiosMock.get.mockResolvedValueOnce({
      data
    });
  });
  const history = createMemoryHistory()
  const { getByText, getByLabelText } = render(<Router history={history}><Brewerlist /></Router>);

  await waitFor(() => expect(getByText("Sherman Brewery")).toBeInTheDocument());  
  await waitFor(() => expect(getByText("Avondale Brewing Co")).toBeInTheDocument());  
  expect(axiosMock.get).toHaveBeenCalledTimes(1)
});

it("lands on the page and searches by state", async () => {
  act(() => {
    axiosMock.get.mockResolvedValueOnce({
      data
    });
  });
  
  const history = createMemoryHistory()
  const { getByText, getAllByTestId, getByTestId } = render(<Router history={history}><Brewerlist /></Router>);
  const searchInput = getByTestId("search");

  
  await waitFor(() => expect(getByText("Sherman Brewery")).toBeInTheDocument());  
  await waitFor(() => expect(getByText("Avondale Brewing Co")).toBeInTheDocument());  

  expect(searchInput).toBeDisabled();

    fireEvent.change(getByTestId("select"), { target: { value: "state" } });
    let typeOptions = getAllByTestId("type-option");
    expect(typeOptions[0].selected).toBeTruthy();
    expect(typeOptions[1].selected).toBeFalsy();

    
  expect(getByText("Search by State:")).toBeInTheDocument();
  
  expect(searchInput).not.toBeDisabled();

  fireEvent.change(searchInput, { target: { value: "ohio" } });
  expect(searchInput.value).toBe("ohio");
  

    axiosMock.get.mockResolvedValueOnce({
      ohio
    });
    
    fireEvent.click(getByText("Sort"));

  expect(axiosMock.get).toHaveBeenCalledTimes(2);
  
  expect(axiosMock.get).toHaveBeenCalledWith(loadingUrl)
  expect(axiosMock.get).toHaveBeenCalledWith(searchUrl)
})

it("lands on the page and select sort by brewery_type submitting an empty field", async () => {
  act(() => {
    axiosMock.get.mockResolvedValueOnce({
      data
    });
  })
  const history = createMemoryHistory()
  const { getByText, getAllByTestId, getByTestId } = render(<Router history={history}><Brewerlist /></Router>);

  fireEvent.change(getByTestId("select"), { target: { value: "brewery_type" } });
    let typeOptions = getAllByTestId("type-option");
    expect(typeOptions[0].selected).toBeFalsy();
    expect(typeOptions[1].selected).toBeTruthy();

  const searchInput = getByTestId("search");
    
  expect(getByText("Search by Brewery Type:")).toBeInTheDocument();
  
  expect(searchInput).not.toBeDisabled();
    
  fireEvent.click(getByText("Sort"));

  expect(getByText("Please add a value")).toBeInTheDocument();
});



import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from './components/Header'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    activeTabId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
    projectsData: [],
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeTabId} = this.state
    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const response = await fetch(projectsApiUrl)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeOptionId = event => {
    console.log(event.target.value)
    this.setState({activeTabId: event.target.value}, this.getProjectsData)
  }

  renderApiLoadingView = () => (
    <div className="loader" data-testId="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderApiSuccessView = () => {
    const {projectsData} = this.state
    return (
      <>
        <ul className="list-Container">
          {projectsData.map(eachProject => (
            <li key={eachProject.id} className="list-item">
              <img
                src={eachProject.imageUrl}
                alt={eachProject.name}
                className="image-size"
              />
              <div className="text-container">
                <p className="text">{eachProject.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  onClickRetry = () => {
    this.getProjectsData()
  }

  renderApiFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderApiSuccessView()
      case apiStatusConstants.failure:
        return this.renderApiFailureView()
      case apiStatusConstants.inProgress:
        return this.renderApiLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="projects">
          <select className="categories" onChange={this.onChangeOptionId}>
            {categoriesList.map(eachCategory => (
              <option key={eachCategory.id} value={eachCategory.id}>
                {' '}
                {eachCategory.displayText}{' '}
              </option>
            ))}
          </select>
          <div className="projects-details">{this.renderProjects()}</div>
        </div>
      </>
    )
  }
}

export default App

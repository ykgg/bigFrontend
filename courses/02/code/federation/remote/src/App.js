import React, { Fragment } from 'react'
import Header from './Header'

class App extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <h2>remote 应用</h2>
        <Header />
        <hr />
      </Fragment>
    )
  }
}

export default App


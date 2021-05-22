import React, { Fragment } from 'react'

// 在此处去加载远端的 Header 组件 
const RemoteHeader = React.lazy(() => {
  return import('remote/Header')
})

class App extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <h2>host 应用</h2>
        <React.Suspense fallback="remote header is loading.....">
          <RemoteHeader />
        </React.Suspense>
        <hr />
      </Fragment>
    )
  }
}

export default App


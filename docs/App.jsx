import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '../src/hooks/use-intersection-observer'
import { useResizeObserver } from '../src/hooks/use-resize-observer'
import {
  useDebug,
  useDocumentReadyState,
  useFrame,
  useIsClient,
  useIsTouchDevice,
  useRect,
  useMediaQuery,
  useWindowSize,
  useLazyState,
  useFramerate,
} from '../src/index'

if (typeof window !== 'undefined') {
  window.useRect = useRect
}

function App() {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // setCounter((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const [get, set] = useLazyState(
    0,
    (value, prevValue) => {
      console.log('set', value, prevValue)
    },
    [counter],
  )

  useFramerate(1, (time, deltaTime) => {
    console.log('time', time, 'deltaTime', deltaTime)
  })

  const [setRectRef, rect, setRectWrapperRef] = useRect({})
  const [setResizeObserverRef, entry] = useResizeObserver({})

  useEffect(() => {
    console.log(entry?.borderBoxSize?.[0], entry?.contentRect, entry?.contentBoxSize?.[0])
  }, [entry])

  const isTouch = useIsTouchDevice()
  const debug = useDebug()
  const isClient = useIsClient()
  const readyState = useDocumentReadyState()
  const [setIntersectionRef, intersection] = useIntersectionObserver({ lazy: false })
  const isMobile = useMediaQuery('(max-width: 800px)')
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  const frameRef = useRef()

  useFrame((time, deltaTime) => {
    // console.log({ time, deltaTime })
    frameRef.current.textContent = `time: ${time} / deltaTime: ${deltaTime}`
  })

  const contentRef = useRef()

  // useEffect(() => {
  //   useRect.observe(contentRef.current)

  //   return () => {
  //     useRect.unobserve(contentRef.current)
  //   }
  // }, [])

  useEffect(() => {
    // setRectWrapperRef(document.querySelector('#root'))
  }, [setRectWrapperRef])

  return (
    <main
      className="main"
      ref={(node) => {
        setIntersectionRef(node)
        contentRef.current = node
      }}
    >
      <p ref={frameRef}></p>
      <p>
        window: {windowWidth} / {windowHeight}
      </p>
      <p>is touch? {isTouch ? 'yes' : 'no'}</p>
      <p>is debug? {debug ? 'yes' : 'no'}</p>
      <p>document readyState? {readyState}</p>
      <p>is in viewport? {intersection.isIntersecting ? 'yes' : 'no'}</p>
      <p>is client? {isClient ? 'yes' : 'no'}</p>
      <p>is mobile? {isMobile ? 'yes' : 'no'}</p>
      <div ref={setResizeObserverRef} className="rect">
        {entry?.borderBoxSize?.[0].inlineSize} x {entry?.borderBoxSize?.[0].blockSize}
      </div>
      <div className="rect-wrapper">
        <div ref={setRectRef} className="rect">
          top: {rect?.top}
          <br />
          height: {rect?.height}
          <br />
          left: {rect?.left}
          <br />
          width: {rect?.width}
          <br />
          bottom: {rect?.bottom}
          <br />
          right: {rect?.right}
        </div>
      </div>
    </main>
  )
}

export default App

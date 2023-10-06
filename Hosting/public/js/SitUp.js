const video = document.getElementsByClassName('input_video')[0]
const out = document.getElementsByClassName('output')[0]
const controlsElement = document.getElementsByClassName('control')[0]
const canvasCtx = out.getContext('2d')

const fpsControl = new FPS()

const spinner = document.querySelector('.loading')
spinner.ontransitionend = () => {
  spinner.style.display = 'none'
}

// Sit up counter stuff
let angle = 0.0
let stage = "DOWN"
let counter = 0 

function zColor(data) {
  const z = clamp(data.from.z + 0.5, 0, 1)
  return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`
}

function calculateAngle(shoulder, elbow, wrist) {
  let radians = Math.atan2(wrist[1]-elbow[1], wrist[0]-elbow[0]) - 
    Math.atan2(shoulder[1]-elbow[1], shoulder[0]-elbow[0]);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

function onResultsPose(results) {
  document.body.classList.add('loaded')
  fpsControl.tick()

  canvasCtx.save()
  canvasCtx.clearRect(0, 0, out.width, out.height)
  canvasCtx.drawImage(results.image, 0, 0, out.width, out.height)

  drawConnectors(
    canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: (data) => {
        const x0 = out.width * data.from.x
        const y0 = out.height * data.from.y
        const x1 = out.width * data.to.x
        const y1 = out.height * data.to.y

        const z0 = clamp(data.from.z + 0.5, 0, 1)
        const z1 = clamp(data.to.z + 0.5, 0, 1)

        const gradient = canvasCtx.createLinearGradient(x0, y0, x1, y1)
        gradient.addColorStop(
            0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`)
        gradient.addColorStop(
            1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`)
        return gradient
      }
    }
  )
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_LANDMARKS_RIGHT)
      .map(index => results.poseLandmarks[index]),
    {color: zColor, fillColor: '#FF0000'})
    // console.log(Object.values(POSE_LANDMARKS_RIGHT))
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_LANDMARKS_LEFT)
      .map(index => results.poseLandmarks[index]),
    {color: zColor, fillColor: '#00FF00'})
    // console.log(Object.values(POSE_LANDMARKS_LEFT))
  drawLandmarks(
    canvasCtx,
    Object.values(POSE_LANDMARKS_NEUTRAL)
      .map(index => results.poseLandmarks[index]),
    {color: zColor, fillColor: '#AAAAAA'})
    // console.log(Object.values(POSE_LANDMARKS_NEUTRAL))

  const landmarksRight = Object.values(POSE_LANDMARKS_LEFT)
    .map(index => results.poseLandmarks[index])

  const shoulder = [landmarksRight[5].x, landmarksRight[5].y]
  const elbow = [landmarksRight[6].x, landmarksRight[6].y]
  const wrist = [landmarksRight[7].x, landmarksRight[7].y]

  angle = calculateAngle(shoulder, elbow, wrist)

  if(angle > 140) {
    stage = "DOWN"
  }
  if(angle < 30 && stage == "DOWN") {
    stage = "UP"
    counter += 1
  }

  canvasCtx.font = "30px Arial";
  canvasCtx.fillStyle = "red";
  canvasCtx.fillText(stage + ": " + counter.toString(), 320, 50);
  canvasCtx.restore()
}

const pose = new Pose(
    {locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`
    }
  }
)
pose.onResults(onResultsPose)

const camera = new Camera(video, {
  onFrame: async () => {
    await pose.send({image: video})
  },
  width: 480,
  height: 480
})
camera.start()

new ControlPanel(controlsElement, {
  selfieMode: true,
  upperBodyOnly: false,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
})
.add([
  new StaticText({title: 'MediaPipe Pose'}),
  fpsControl,
  // new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
  // new Toggle({title: 'Upper-body Only', field: 'upperBodyOnly'}),
  // new Toggle({title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
  // new Slider({
  //   title: 'Min Detection Confidence',
  //   field: 'minDetectionConfidence',
  //   range: [0, 1],
  //   step: 0.01
  // }),
  // new Slider({
  //   title: 'Min Tracking Confidence',
  //   field: 'minTrackingConfidence',
  //   range: [0, 1],
  //   step: 0.01
  // }),
])
.on(options => {
  video.classList.toggle('selfie', options.selfieMode)
  pose.setOptions(options)
})

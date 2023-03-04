function PushUp(data) {
    const rightShoulder = Object.values(POSE_LANDMARKS_RIGHT[12])
    const rightElbow = Object.values(POSE_LANDMARKS_RIGHT[14])
    const leftShoulder = Object.values(POSE_LANDMARKS_LEFT[11])
    const leftElbow = Object.values(POSE_LANDMARKS_LEFT[13]) 

    const count = 0
    f = 0

    if (rightShoulder == rightElbow && leftShoulder == leftElbow) {
        f = 1
    }else {
        f = 0
        count += 1
    }

    return count
}
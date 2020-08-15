function validateGeoJson(Geojson) {
    switch (Geojson.type) {
        case "Polygon":
            if (!Array.isArray(Geojson.coordinates))
                return false;
            let flag = true;
            Geojson.coordinates.forEach(secondDimension => {
                if (!Array.isArray(secondDimension)) {
                    flag = false;
                    return false;
                }
                let length = secondDimension.length;
                if (length < 3) {
                    flag = false;
                    return false;
                }
                if (secondDimension.filter(point => isPoint(point)).length !== length) {
                    flag = false;
                    return false;
                }
                if (secondDimension[0][0] !== secondDimension[length - 1][0] ||
                    secondDimension[0][1] !== secondDimension[length - 1][1]) {
                    flag = false;
                    return false;
                }
            });
            return flag;
        case "MultiPolygon":
            if (!Array.isArray(Geojson.coordinates))
                return false;
            let flagM = true;
            Geojson.coordinates.forEach(secondDimension => {
                if (!Array.isArray(secondDimension)) {
                    flagM = false;
                    return false;
                }
                secondDimension.forEach(thirdDimension => {
                    if (!Array.isArray(thirdDimension)) {
                        flagM = false;
                        return false;
                    }
                    let length = thirdDimension.length;
                    if (length < 3) {
                        flagM = false;
                        return false;
                    }
                    if (thirdDimension.filter(point => isPoint(point)).length !== length) {
                        flagM = false;
                        return false;
                    }
                    if (thirdDimension[0][0] !== thirdDimension[length - 1][0] ||
                        thirdDimension[0][1] !== thirdDimension[length - 1][1]) {
                        flagM = false;
                        return false;
                    }
                });
            });
            return flagM;
        case "Point":
            return isPoint(Geojson.coordinates);
        default:
            return false;
    }
}
function isPoint(point) {
    if (!Array.isArray(point)) {
        return false;
    }
    if (point.length !== 2)
        return false;
    if ((typeof point[0] !== "number") || (typeof point[1] !== "number"))
        return false;
    if (point[0] < -180 || point[0] > 180 || point[1] < -90 || point[1] > 90) {
        return false;
    }

    return true;
}
exports.validateGeoJson = validateGeoJson;
exports.isPoint = isPoint;
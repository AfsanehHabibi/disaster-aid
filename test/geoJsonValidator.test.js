const assert = require('assert');
const validator = require('../src/validator/geoJsonValidator').validateGeoJson
describe('GeoJson Validator', () => {
    it('should accept valid multiPolygon', () => {
        assert.equal(validator({
            "type": "MultiPolygon",
            "coordinates": [
                [[[-73.958, 40.8003], [-73.9498, 40.7968], [-73.9737, 40.7648], [-73.9814, 40.7681], [-73.958, 40.8003]]],
                [[[-73.958, 40.8003], [-73.9498, 40.7968], [-73.9737, 40.7648], [-73.958, 40.8003]]]
            ]
        }), true);
    });
    it('should not accept open multiPolygon', () => {
        assert.equal(validator({
            "type": "MultiPolygon",
            "coordinates": [
                [[[-73.9498, 40.7968], [-73.9737, 40.7648], [-73.9814, 40.7681], [-73.958, 40.8003]]],
                [[[-73.958, 40.8003], [-73.9498, 40.7968], [-73.9737, 40.7648], [-73.958, 40.8003]]]
            ]
        }), false);
    });
    it('should not accept wrong format for multiPolygon', () => {
        assert.equal(validator({
            "type": "MultiPolygon",
            "coordinates": [
                [[-73.958, 40.8003], [-73.9498, 40.7968], [-73.9737, 40.7648], [-73.9814, 40.7681], [-73.958, 40.8003]],
                [[[-73.958, 40.8003], [-73.9498, 40.7968], [-73.9737, 40.7648], [-73.958, 40.8003]]]
            ]
        }), false);
    });
    it('should accept Plygon with multiple rings', () => {
        assert.equal(validator({
            type: "Polygon",
            coordinates: [
                [[0, 0], [3, 6], [6, 1], [0, 0]],
                [[2, 2], [3, 3], [4, 2], [2, 2]]
            ]
        }), true);
    });
    it('should accept Plygon with a single rings', () => {
        assert.equal(validator({
            type: "Polygon",
            coordinates: [[[0, 0], [3, 6], [6, 1], [0, 0]]]
        }), true);
    });
    it('should not accept wrong format for Plygon', () => {
        assert.equal(validator({
            "type": "Polygon",
            "coordinates": [[
                {
                    "lat": -6,
                    "long": 61
                },
                [
                    -6.76184,
                    62.01528
                ],
                [
                    -6.78213,
                    62.01058
                ],
                [
                    -6.78008,
                    62.02489
                ],
                [
                    -6.75864,
                    62.01517
                ]
            ]
            ]
        }), false);
    });
    it('should not accept wrong format for Plygon', () => {
        assert.equal(validator({
            type: "Polygon",
            coordinates: [{ "Points": [[0, 0], [3, 6], [6, 1], [0, 0]] }]
        }), false);
    });
    it('should not accept open Plygon', () => {
        assert.equal(validator({
            type: "Polygon",
            coordinates: [{ "Points": [[0, 0], [3, 6], [6, 1]] }]
        }), false);
    });
    it('should accept valid Point', () => {
        assert.equal(validator({
            "type": "Point", "coordinates": [
                51.3775634765625,
                35.70369406336514
            ]
        }), true);
    });
    it('should not accept out of boundery number for Point', () => {
        assert.equal(validator({
            "type": "Point", "coordinates": [
                181.896936866673,
                51.3775634765625
            ]
        }), false);
    });
});
import * as Layout from "../../../src/core/layout/layout.js";
import * as setUpAchievementsButton from "../../../src/core/layout/set-up-achievements-button.js"
import { createMockGmi } from "../../mock/gmi";

jest.mock("../../../src/core/layout/group.js");

describe("setUpAchievementsButton", () => {

    let mockGmi;
    let mockGame
    
    beforeEach(() => {
        mockGmi = {
            getAllSettings: jest.fn(() => ({ motion: "motion-data", audio: "audio-data" })),
        };
        createMockGmi(mockGmi);
    });

    describe("setUpAchievementsButton Method", () => {
        test("is called with the correct parameters", () => {
            
            mockGame = { mock: "game" };
            const mockMetrics = {
                horizontals: jest.fn(),
                safeHorizontals: jest.fn(),
                verticals: jest.fn(),
            };
            const layout1 = Layout.create(mockGame, mockMetrics, ["achievements"]);

            setUpAchievementsButton.setUpAchievementsButton(mockGame, layout1, false);
            expect(setUpAchievementsButton.setUpAchievementsButton).toHaveBeenCalledWith(mockGame, layout1, false);
        });
    });
});

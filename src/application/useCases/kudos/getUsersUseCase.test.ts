import {
  GetUsersUseCase,
  IPaginationParams,
  IPaginatedUsers,
} from "./getUsersUseCase";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

// Mock only the external http client
jest.mock("@/infrastructure/http/httpClient", () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

describe("GetUsersUseCase", () => {
  let useCase: GetUsersUseCase;
  const mockToken = "mock-token";

  beforeEach(() => {
    useCase = new GetUsersUseCase();
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage getAuthToken
    jest.spyOn(LocalStorageService, "getAuthToken").mockReturnValue(mockToken);
  });

  describe("execute", () => {
    it("should fetch users with default pagination", async () => {
      // Mock API response with array format
      const mockResponse = {
        data: {
          success: true,
          data: [
            {
              id: "1",
              name: "John Doe",
              email: "john@example.com",
              role: "user",
              isVerified: true,
              team: { id: "team1", name: "Team A" },
            },
          ],
          message: "Success",
          statusCode: 200,
        },
      };

      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await useCase.execute();

      expect(httpClient.get).toHaveBeenCalledWith("/api/admin/users", {
        headers: { Authorization: `Bearer ${mockToken}` },
      });

      expect(result).toEqual({
        users: [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            isVerified: true,
            verificationStatus: "Verified",
            team: { id: "team1", name: "Team A" },
          },
        ],
        total: 1,
        offset: 0,
        limit: 1,
      });
    });

    it("should fetch users with custom pagination", async () => {
      const paginationParams: IPaginationParams = {
        offset: 10,
        limit: 20,
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            users: [
              {
                id: "2",
                name: "Jane Smith",
                email: "jane@example.com",
                role: "admin",
                isVerified: false,
                teamId: {
                  _id: "team2",
                  name: "Team B",
                  createdAt: "2024-01-01",
                  updatedAt: "2024-01-01",
                  __v: 0,
                },
              },
            ],
            total: 50,
          },
          message: "Success",
          statusCode: 200,
          pagination: {
            total: 50,
            offset: 10,
            limit: 20,
          },
        },
      };

      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await useCase.execute(paginationParams);

      expect(httpClient.get).toHaveBeenCalledWith("/api/admin/users", {
        headers: { Authorization: `Bearer ${mockToken}` },
        params: {
          offset: 10,
          limit: 20,
        },
      });

      expect(result).toEqual({
        users: [
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "admin",
            isVerified: false,
            verificationStatus: "Pending",
            team: { id: "team2", name: "Team B" },
            teamId: {
              _id: "team2",
              name: "Team B",
              createdAt: "2024-01-01",
              updatedAt: "2024-01-01",
              __v: 0,
            },
          },
        ],
        total: 50,
        offset: 10,
        limit: 20,
      });
    });

    it("should handle empty response data", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [],
          message: "Success",
          statusCode: 200,
        },
      };

      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await useCase.execute();

      expect(result).toEqual({
        users: [],
        total: 0,
        offset: 0,
        limit: 0,
      });
    });

    it("should handle API error", async () => {
      (httpClient.get as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(useCase.execute()).rejects.toThrow("Failed to fetch users");
    });

    it("should handle missing auth token", async () => {
      jest.spyOn(LocalStorageService, "getAuthToken").mockReturnValue(null);

      const mockResponse = {
        data: {
          success: true,
          data: [],
          message: "Success",
          statusCode: 200,
        },
      };

      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      await useCase.execute();

      expect(httpClient.get).toHaveBeenCalledWith("/api/admin/users", {
        headers: undefined,
      });
    });

    it("should handle different response data structures", async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            someOtherKey: [
              {
                id: "3",
                name: "Bob Wilson",
                email: "bob@example.com",
                role: "user",
                isVerified: true,
              },
            ],
          },
          message: "Success",
          statusCode: 200,
        },
      };

      (httpClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await useCase.execute();

      expect(result.users).toHaveLength(1);
      expect(result.users[0]).toEqual({
        id: "3",
        name: "Bob Wilson",
        email: "bob@example.com",
        role: "user",
        isVerified: true,
        verificationStatus: "Verified",
      });
    });
  });
});

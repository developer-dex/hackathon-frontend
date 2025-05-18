import { GetKudosListUseCase } from "./getKudosListUseCase";
import { IKudosRepository } from "@/infrastructure/repositories/interfaces/repositories/kudos.interface";
import { IKudos } from "@/domain/entities/Kudos.types";

describe("GetKudosListUseCase", () => {
  let getKudosListUseCase: GetKudosListUseCase;
  let kudosRepository: IKudosRepository;

  beforeEach(() => {
    // We don't mock the repository since it's within our boundaries
    kudosRepository = {
      getKudosList: jest.fn(),
    } as unknown as IKudosRepository;

    getKudosListUseCase = new GetKudosListUseCase(kudosRepository);
  });

  it("should successfully fetch kudos list with default parameters", async () => {
    const mockResponse = {
      data: [
        {
          id: "1",
          receiver: { id: "1", name: "John Doe" },
          sender: { id: "2", name: "Jane Smith" },
          team: { name: "Engineering" },
          createdAt: "2024-03-20T10:00:00Z",
        },
      ],
      pagination: {
        total: 1,
        offset: 0,
        limit: 9,
      },
    };

    (kudosRepository.getKudosList as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getKudosListUseCase.execute();

    expect(result.kudosList).toHaveLength(1);
    expect(result.totalCount).toBe(1);
    expect(result.offset).toBe(0);
    expect(result.limit).toBe(9);
    expect(result.error).toBeUndefined();
    expect(result.kudosList[0]).toHaveProperty("recipientName", "John Doe");
    expect(result.kudosList[0]).toHaveProperty("recipientTeam", "Engineering");
    expect(result.kudosList[0]).toHaveProperty("senderName", "Jane Smith");
  });

  it("should handle empty response from repository", async () => {
    (kudosRepository.getKudosList as jest.Mock).mockResolvedValue(null);

    const result = await getKudosListUseCase.execute();

    expect(result.kudosList).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.error).toBe("Failed to fetch kudos list");
  });

  it("should handle repository errors gracefully", async () => {
    (kudosRepository.getKudosList as jest.Mock).mockRejectedValue(
      new Error("Repository error")
    );

    const result = await getKudosListUseCase.execute();

    expect(result.kudosList).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.error).toBe(
      "An unexpected error occurred while fetching kudos"
    );
  });

  it("should apply filters when provided", async () => {
    const mockResponse = {
      data: [],
      pagination: {
        total: 0,
        offset: 0,
        limit: 9,
      },
    };

    const filters = { senderId: "123", receiverId: "456" };

    (kudosRepository.getKudosList as jest.Mock).mockResolvedValue(mockResponse);

    await getKudosListUseCase.execute(0, 9, filters);

    expect(kudosRepository.getKudosList).toHaveBeenCalledWith(0, 9, filters);
  });

  it("should handle pagination parameters correctly", async () => {
    const mockResponse = {
      data: [],
      pagination: {
        total: 20,
        offset: 10,
        limit: 10,
      },
    };

    (kudosRepository.getKudosList as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getKudosListUseCase.execute(10, 10);

    expect(result.offset).toBe(10);
    expect(result.limit).toBe(10);
    expect(result.totalCount).toBe(20);
  });
});

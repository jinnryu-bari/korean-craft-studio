import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { craftClasses } from "@/mocks/classes";
import { submitClassApplication } from "@/lib/mock-api";
import { PRACTICE_NOTICE_TEXT } from "./PracticeNotice";
import { ClassCatalog } from "./ClassCatalog";

vi.mock("@/lib/mock-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock-api")>();
  return { ...actual, submitClassApplication: vi.fn() };
});

const bojagi = craftClasses[1];

describe("ClassCatalog", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 8, 30, 10, 0));
    vi.mocked(submitClassApplication).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders 4 class cards with name, description, price, duration and capacity", () => {
    render(<ClassCatalog craftClasses={craftClasses} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "도자기 만들기" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "보자기 만들기" })).toBeInTheDocument();

    const pottery = screen.getByRole("article", { name: "도자기 만들기" });
    expect(within(pottery).getByText(craftClasses[0].description)).toBeInTheDocument();
    expect(within(pottery).getByText("65,000원")).toBeInTheDocument();
    expect(within(pottery).getByText("2시간 30분")).toBeInTheDocument();
    expect(within(pottery).getByText("최대 8명")).toBeInTheDocument();
  });

  it("shows the virtual class guide with preparation and cancellation info", () => {
    render(<ClassCatalog craftClasses={craftClasses} />);
    const guide = screen.getByRole("region", { name: "클래스 안내" });
    expect(within(guide).getByText(/실습용 가상 안내/)).toBeInTheDocument();
    expect(within(guide).getByRole("heading", { name: /준비물/ })).toBeInTheDocument();
    expect(within(guide).getByRole("heading", { name: /취소·변경/ })).toBeInTheDocument();
    expect(within(guide).getByText("편한 복장")).toBeInTheDocument();
  });

  it("opens an application dialog for the selected class with labelled fields", async () => {
    const user = userEvent.setup();
    render(<ClassCatalog craftClasses={craftClasses} />);

    await user.click(screen.getByRole("button", { name: `${bojagi.name} 신청하기` }));

    const dialog = screen.getByRole("dialog", { name: `${bojagi.name} 클래스 신청` });
    expect(within(dialog).getByText(PRACTICE_NOTICE_TEXT)).toBeInTheDocument();
    expect(within(dialog).getByRole("textbox", { name: "이름" })).toHaveFocus();
    expect(within(dialog).getByRole("textbox", { name: "연락처" })).toBeInTheDocument();
    expect(within(dialog).getByRole("spinbutton", { name: "인원" })).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/^희망 날짜/)).toHaveAttribute("type", "date");
    expect(within(dialog).getByRole("textbox", { name: "클래스" })).toHaveValue(bojagi.name);
    expect(within(dialog).getByRole("textbox", { name: /^요청사항/ })).toBeInTheDocument();
    expect(within(dialog).getByText("내일부터 90일 이내")).toBeInTheDocument();
  });

  it("blocks submission when headcount exceeds capacity", async () => {
    const user = userEvent.setup();
    render(<ClassCatalog craftClasses={craftClasses} />);
    await user.click(screen.getByRole("button", { name: `${bojagi.name} 신청하기` }));

    await user.type(screen.getByRole("textbox", { name: "이름" }), "홍길동");
    await user.type(screen.getByRole("textbox", { name: "연락처" }), "010-1234-5678");
    const headcount = screen.getByRole("spinbutton", { name: "인원" });
    await user.clear(headcount);
    await user.type(headcount, String(bojagi.capacity + 1));
    fireEvent.change(screen.getByLabelText(/^희망 날짜/), { target: { value: "2026-10-10" } });
    await user.click(screen.getByRole("button", { name: "신청하기" }));

    expect(submitClassApplication).not.toHaveBeenCalled();
    expect(headcount).toHaveAttribute("aria-invalid", "true");
    expect(headcount).toHaveAccessibleDescription(expect.stringContaining(`정원(${bojagi.capacity}명)을 초과할 수 없습니다.`));
    expect(headcount).toHaveFocus();
  });

  it("keeps the displayed capacity unchanged after a successful application", async () => {
    const user = userEvent.setup();
    vi.mocked(submitClassApplication).mockResolvedValue({
      success: true,
      receiptNumber: "OG-20260930-CL01",
      message: "클래스 신청이 접수되었습니다.",
    });
    render(<ClassCatalog craftClasses={craftClasses} />);
    await user.click(screen.getByRole("button", { name: `${bojagi.name} 신청하기` }));

    await user.type(screen.getByRole("textbox", { name: "이름" }), "홍길동");
    await user.type(screen.getByRole("textbox", { name: "연락처" }), "010-1234-5678");
    const headcount = screen.getByRole("spinbutton", { name: "인원" });
    await user.clear(headcount);
    await user.type(headcount, String(bojagi.capacity));
    fireEvent.change(screen.getByLabelText(/^희망 날짜/), { target: { value: "2026-10-10" } });
    await user.click(screen.getByRole("button", { name: "신청하기" }));

    expect(await screen.findByText("OG-20260930-CL01")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const card = screen.getByRole("article", { name: bojagi.name });
    expect(within(card).getByText(`최대 ${bojagi.capacity}명`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: `${bojagi.name} 신청하기` })).toHaveFocus();
  });
});

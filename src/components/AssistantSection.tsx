import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Save,
  Loader2,
  ChevronDown,
  Table,
  Link2,
  Lock,
  CalendarDays,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateAssistant,
  fetchAvailableSheets,
  fetchSpreadsheetSheets,
  fetchSheetColumns,
  connectGoogleSheets,
  disconnectGoogleSheets,
  saveKnowledgeBases,
  setSelectedSpreadsheetId,
  setSelectedSheetId,
  setSelectedPhoneColumnName,
  connectGoogleCalendar,
  disconnectGoogleCalendar,
} from "@/store/assistantSlice";
import { fetchCurrentUser } from "@/store/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export function AssistantSection({ isDark }: { isDark: boolean }) {
  const dispatch = useAppDispatch();
  const assistant = useAppSelector((state) => state.assistant.assistant);
  const status = useAppSelector((state) => state.assistant.updateStatus);
  const availableSpreadsheets = useAppSelector(
    (state) => state.assistant.availableSpreadsheets,
  );
  const availableSpreadsheetsStatus = useAppSelector(
    (state) => state.assistant.availableSpreadsheetsStatus,
  );
  const availableSheetTabs = useAppSelector(
    (state) => state.assistant.availableSheetTabs,
  );
  const availableSheetTabsStatus = useAppSelector(
    (state) => state.assistant.availableSheetTabsStatus,
  );
  const availableSheetColumns = useAppSelector(
    (state) => state.assistant.availableSheetColumns,
  );
  const availableSheetColumnsStatus = useAppSelector(
    (state) => state.assistant.availableSheetColumnsStatus,
  );
  const selectedSpreadsheetId = useAppSelector(
    (state) => state.assistant.selectedSpreadsheetId,
  );
  const selectedSheetId = useAppSelector(
    (state) => state.assistant.selectedSheetId,
  );
  const selectedPhoneColumnName = useAppSelector(
    (state) => state.assistant.selectedPhoneColumnName,
  );
  const lastFetchedSpreadsheetId = useAppSelector(
    (state) => state.assistant.lastFetchedSpreadsheetId,
  );
  const lastFetchedColumnsSpreadsheetId = useAppSelector(
    (state) => state.assistant.lastFetchedColumnsSpreadsheetId,
  );
  const lastFetchedColumnsSheetId = useAppSelector(
    (state) => state.assistant.lastFetchedColumnsSheetId,
  );
  const isUpdating = status === "loading";
  const hasGoogleCreds = assistant?.credentials?.google_sheets?.status;
  const hasGoogleCalendarCreds =
    assistant?.credentials?.google_calendar?.status;

  const [formData, setFormData] = useState({
    openingLine: "",
    prompt: "",
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (assistant) {
      setFormData({
        openingLine: assistant.openingLine || assistant.firstLine || "",
        prompt: assistant.prompt || "",
      });
      const existing =
        assistant?.knowledge_bases
          ?.filter((kb) => kb.type === "google_sheets")
          .map((kb) => kb.id) || [];
      dispatch(setSelectedSheetId(existing[0] || ""));
      const existingSpreadsheet =
        assistant?.knowledge_bases
          ?.filter((kb) => kb.type === "google_sheets")
          .map((kb) => kb.spreadsheetId)
          .filter(Boolean) || [];
      dispatch(setSelectedSpreadsheetId(existingSpreadsheet[0] || ""));
      const existingPhoneColumn =
        assistant?.knowledge_bases
          ?.filter((kb) => kb.type === "google_sheets")
          .map((kb) => kb.phoneColumnName)
          .filter(Boolean) || [];
      dispatch(setSelectedPhoneColumnName(existingPhoneColumn[0] || ""));
    }
  }, [assistant, dispatch]);

  useEffect(() => {
    if (hasGoogleCreds && availableSpreadsheets.length === 0) {
      dispatch(fetchAvailableSheets());
    }
  }, [hasGoogleCreds, availableSpreadsheets.length, dispatch]);

  useEffect(() => {
    if (
      hasGoogleCreds &&
      selectedSpreadsheetId &&
      selectedSpreadsheetId !== lastFetchedSpreadsheetId
    ) {
      dispatch(fetchSpreadsheetSheets(selectedSpreadsheetId));
    }
  }, [
    hasGoogleCreds,
    selectedSpreadsheetId,
    lastFetchedSpreadsheetId,
    dispatch,
  ]);

  useEffect(() => {
    if (
      hasGoogleCreds &&
      selectedSpreadsheetId &&
      selectedSheetId &&
      (selectedSpreadsheetId !== lastFetchedColumnsSpreadsheetId ||
        selectedSheetId !== lastFetchedColumnsSheetId)
    ) {
      dispatch(
        fetchSheetColumns({
          spreadsheetId: selectedSpreadsheetId,
          sheetId: selectedSheetId,
        }),
      );
    }
  }, [
    hasGoogleCreds,
    selectedSpreadsheetId,
    selectedSheetId,
    lastFetchedColumnsSpreadsheetId,
    lastFetchedColumnsSheetId,
    dispatch,
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!formData.prompt.trim() || !formData.openingLine.trim()) {
      toast.error("Both Prompt and First Line are required.");
      return;
    }
    try {
      await dispatch(updateAssistant(formData)).unwrap();
      toast.success("Assistant updated successfully");
    } catch (err: any) {
      toast.error(err || "Failed to update assistant");
    }
  };

  const handleSelectSheet = async (sheetId: string) => {
    dispatch(setSelectedSheetId(sheetId));
    dispatch(setSelectedPhoneColumnName(""));
    const selected = availableSheetTabs.find((sheet) => sheet.id === sheetId);
    if (!selected) {
      return;
    }
    const updatedBase = {
      ...selected,
      spreadsheetId: selectedSpreadsheetId,
    };
    setIsConnecting(true);
    try {
      await dispatch(saveKnowledgeBases([updatedBase])).unwrap();
      toast.success("Knowledge base updated");
      dispatch(fetchCurrentUser());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update knowledge base");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectPhoneColumn = async (columnName: string) => {
    dispatch(setSelectedPhoneColumnName(columnName));
    const selected = availableSheetTabs.find(
      (sheet) => sheet.id === selectedSheetId,
    );
    if (!selected) {
      return;
    }
    const updatedBase = {
      ...selected,
      spreadsheetId: selectedSpreadsheetId,
      phoneColumnName: columnName,
    };
    setIsConnecting(true);
    try {
      await dispatch(saveKnowledgeBases([updatedBase])).unwrap();
      toast.success("Knowledge base updated");
      dispatch(fetchCurrentUser());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to update knowledge base");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsConnecting(true);
    try {
      await dispatch(disconnectGoogleSheets()).unwrap();
      toast.success("Google Sheets disconnected");
      dispatch(setSelectedSheetId(""));
      dispatch(setSelectedSpreadsheetId(""));
      dispatch(setSelectedPhoneColumnName(""));
      dispatch(fetchCurrentUser());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to disconnect Google Sheets");
    } finally {
      setIsConnecting(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly profile email",
    onSuccess: async (codeResponse) => {
      try {
        setIsConnecting(true);
        await dispatch(
          connectGoogleSheets({ code: codeResponse.code, sheetUrl: "" }),
        ).unwrap();
        toast.success("Successfully connected Google Sheets");
        dispatch(fetchCurrentUser());
        dispatch(fetchAvailableSheets());
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message || "Failed to connect Google Sheets");
      } finally {
        setIsConnecting(false);
      }
    },
    onError: (error) => {
      toast.error("Google authentication failed");
      console.error(error);
    },
  });

  const loginWithGoogleCalendar = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/calendar profile email",
    onSuccess: async (codeResponse) => {
      try {
        setIsConnecting(true);
        await dispatch(
          connectGoogleCalendar({ code: codeResponse.code }),
        ).unwrap();
        toast.success("Successfully connected Google Calendar");
        dispatch(fetchCurrentUser());
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message || "Failed to connect Google Calendar");
      } finally {
        setIsConnecting(false);
      }
    },
    onError: (error) => {
      toast.error("Google authentication failed");
      console.error(error);
    },
  });

  const handleDisconnectCalendar = async () => {
    setIsConnecting(true);
    try {
      await dispatch(disconnectGoogleCalendar()).unwrap();
      toast.success("Google Calendar disconnected");
      dispatch(fetchCurrentUser());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Failed to disconnect Google Calendar");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectGoogle = () => {
    loginWithGoogle();
  };

  const initialOpeningLine =
    assistant?.openingLine || assistant?.firstLine || "";
  const initialPrompt = assistant?.prompt || "";
  const hasChanges =
    formData.openingLine !== initialOpeningLine ||
    formData.prompt !== initialPrompt;

  return (
    <main className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl flex items-center gap-3 font-semibold tracking-tight">
              <Bot className="h-6 w-6 text-[#2563eb]" />
              Assistant Configuration
            </h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mt-2`}>
              Manage your AI Assistant's personality, script, and first spoken
              line.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Link2 className="h-4 w-4" />
                Connect CRM
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={isConnecting}
                onSelect={() => {
                  if (hasGoogleCreds) {
                    handleDisconnect();
                  } else {
                    handleConnectGoogle();
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  {hasGoogleCreds
                    ? "Disconnect Google Sheets"
                    : "Connect Google Sheets"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isConnecting}
                onSelect={() => {
                  if (hasGoogleCalendarCreds) {
                    handleDisconnectCalendar();
                  } else {
                    loginWithGoogleCalendar();
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {hasGoogleCalendarCreds
                    ? "Disconnect Google Calendar"
                    : "Connect Google Calendar"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <span className="flex items-center gap-2 text-gray-400">
                  <Lock className="h-4 w-4" />
                  ReapitSales (Coming soon)
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <span className="flex items-center gap-2 text-gray-400">
                  <Lock className="h-4 w-4" />
                  Rex (Coming soon)
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card
          className={`${isDark ? "bg-gray-800 border-gray-700 text-white" : ""}`}
        >
          <CardHeader>
            <CardTitle>Assistant Identity</CardTitle>
            <CardDescription className={`${isDark ? "text-gray-400" : ""}`}>
              These settings define how your Assistant introduces itself and
              handles calls.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="openingLine" className="text-sm font-medium">
                First Spoken Line (Opening Line)
              </Label>
              <Input
                id="openingLine"
                name="openingLine"
                value={formData.openingLine}
                onChange={handleChange}
                placeholder="e.g., Hi, this is Jasmeet from VoxaRealty. How can I help you today?"
                className={`${isDark ? "bg-gray-900 border-gray-700 text-white" : ""}`}
              />
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
              >
                The very first message the AI will say when a call connects.
                Keep it short and welcoming.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="prompt" className="text-sm font-medium">
                System Prompt (Instructions)
              </Label>
              <Textarea
                id="prompt"
                name="prompt"
                rows={12}
                value={formData.prompt}
                onChange={handleChange}
                placeholder="You are an expert real estate assistant..."
                className={`resize-y ${isDark ? "bg-gray-900 border-gray-700 text-white" : ""}`}
              />
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
              >
                The core instructions that dictate the assistant's behavior,
                knowledge boundaries, and conversational style.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isUpdating || !hasChanges}
                className="w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>

            <div className="border-t border-gray-200/60 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Knowledge Base</h3>
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
                  >
                    Connect Google Sheets and choose a spreadsheet and sheet to
                    use for answers.
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    hasGoogleCreds
                      ? "bg-emerald-100 text-emerald-700 border-none"
                      : "bg-gray-100 text-gray-600 border-none"
                  }
                >
                  {hasGoogleCreds ? "Connected" : "Not connected"}
                </Badge>
              </div>

              <div className="mt-4 space-y-4">
                {hasGoogleCreds ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Spreadsheets ({availableSpreadsheets.length})
                      </Label>
                      {availableSpreadsheetsStatus === "loading" ? (
                        <p className="text-sm text-gray-500 mt-2">
                          Loading spreadsheets...
                        </p>
                      ) : availableSpreadsheets.length === 0 ? (
                        <p className="text-sm text-gray-500 mt-2">
                          No spreadsheets found in your Drive.
                        </p>
                      ) : (
                        <div className="mt-3">
                          <Select
                            value={selectedSpreadsheetId}
                            onValueChange={(value) => {
                              dispatch(setSelectedSpreadsheetId(value));
                              dispatch(setSelectedSheetId(""));
                              dispatch(setSelectedPhoneColumnName(""));
                            }}
                          >
                            <SelectTrigger
                              className={`${isDark ? "bg-gray-900 border-gray-700 text-white" : ""}`}
                            >
                              <SelectValue placeholder="Select a spreadsheet" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSpreadsheets.map((sheet) => (
                                <SelectItem key={sheet.id} value={sheet.id}>
                                  {sheet.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    {selectedSpreadsheetId && (
                      <div>
                        <Label className="text-sm font-medium">
                          Sheets ({availableSheetTabs.length})
                        </Label>
                        {availableSheetTabsStatus === "loading" ? (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading sheets...
                          </p>
                        ) : availableSheetTabs.length === 0 ? (
                          <p className="text-sm text-gray-500 mt-2">
                            No sheets found in this spreadsheet.
                          </p>
                        ) : (
                          <div className="mt-3">
                            <Select
                              value={selectedSheetId}
                              onValueChange={handleSelectSheet}
                            >
                              <SelectTrigger
                                className={`${isDark ? "bg-gray-900 border-gray-700 text-white" : ""}`}
                              >
                                <SelectValue placeholder="Select a sheet" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableSheetTabs.map((sheet) => (
                                  <SelectItem key={sheet.id} value={sheet.id}>
                                    {sheet.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {selectedSheetId && (
                          <div className="mt-4">
                            <Label className="text-sm font-medium">
                              Map Column (Phone Number)
                            </Label>
                            {availableSheetColumnsStatus === "loading" ? (
                              <p className="text-sm text-gray-500 mt-2">
                                Loading columns...
                              </p>
                            ) : availableSheetColumns.length === 0 ? (
                              <p className="text-sm text-gray-500 mt-2">
                                No columns found in this sheet.
                              </p>
                            ) : (
                              <div className="mt-3">
                                <Select
                                  value={selectedPhoneColumnName}
                                  onValueChange={handleSelectPhoneColumn}
                                >
                                  <SelectTrigger
                                    className={`${isDark ? "bg-gray-900 border-gray-700 text-white" : ""}`}
                                  >
                                    <SelectValue placeholder="Select a column" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableSheetColumns.map((column) => (
                                      <SelectItem
                                        key={column.id}
                                        value={column.name}
                                      >
                                        {column.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            <p
                              className={`text-xs ${isDark ? "text-gray-400" : "text-muted-foreground"} mt-2`}
                            >
                              Used to match callers by phone number and pre-fill
                              details in the assistant prompt.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
                  >
                    Connect Google Sheets from the Connect CRM menu to load your
                    spreadsheets.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

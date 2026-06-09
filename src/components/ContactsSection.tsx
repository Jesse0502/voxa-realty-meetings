import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Save,
  Plus,
  ArrowRight,
  User,
  Play,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedContact,
  createContact,
  fetchContactDetail,
  fetchContacts,
  setCurrentPage,
  updateContact,
} from "@/store/contactsSlice";
import { fetchCallsPage } from "@/store/callsSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";

interface ContactsSectionProps {
  isDark: boolean;
}

const CONTACT_CALLS_PER_PAGE = 25;

type ReviewCall = {
  id?: string;
  _id?: string;
  transcript?: string;
  recordingUrl?: string;
  endedReason?: string;
  direction?: string;
  durationSeconds?: number;
  callerNumber?: string;
  createdAt?: string;
  structuredOutputs?: Record<string, string | undefined>;
};

export function ContactsSection({ isDark }: ContactsSectionProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { contactId } = useParams<{ contactId?: string }>();
  const handledLocationKeyRef = useRef<string | null>(null);
  const attemptedCallHydrationKeysRef = useRef<Set<string>>(new Set());
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const calls = useAppSelector((state) => state.calls.calls);
  const callsFetchStatus = useAppSelector((state) => state.calls.fetchStatus);
  const status = useAppSelector((state) => state.contacts.status);
  const error = useAppSelector((state) => state.contacts.error);
  const selectedContactId = useAppSelector((state) => state.contacts.selectedContactId);
  const selectedContactStatus = useAppSelector((state) => state.contacts.selectedContactStatus);
  const selectedContactError = useAppSelector((state) => state.contacts.selectedContactError);
  const currentPage = useAppSelector((state) => state.contacts.currentPage);
  const pageSize = useAppSelector((state) => state.contacts.pageSize);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+61");
  const [customCountryCode, setCustomCountryCode] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactAbout, setNewContactAbout] = useState("");
  const [detailName, setDetailName] = useState("");
  const [detailAbout, setDetailAbout] = useState("");
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactCallsPage, setContactCallsPage] = useState(1);
  const [selectedReviewCall, setSelectedReviewCall] =
    useState<ReviewCall | null>(null);

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedContactId) ?? null,
    [contacts, selectedContactId],
  );

  useEffect(() => {
    const routeContactId = contactId?.trim();

    if (!routeContactId) {
      if (selectedContactId) {
        dispatch(clearSelectedContact());
      }
      return;
    }

    if (
      routeContactId !== selectedContactId ||
      (!selectedContact && selectedContactStatus === "idle")
    ) {
      dispatch(fetchContactDetail(routeContactId));
    }
  }, [
    contactId,
    dispatch,
    selectedContact,
    selectedContactId,
    selectedContactStatus,
  ]);

  const callsById = useMemo(() => {
    const byId = new Map<string, ReviewCall>();
    for (const call of calls) {
      const key = String(call._id || call.id || "").trim();
      if (key && !byId.has(key)) {
        byId.set(key, call as ReviewCall);
      }
    }
    return byId;
  }, [calls]);

  const totalPages = Math.max(1, Math.ceil(contacts.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedContacts = contacts.slice(startIndex, startIndex + pageSize);

  const pageButtonNumbers = (() => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  })();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContacts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (contacts.length > 0 && currentPage > totalPages) {
      dispatch(setCurrentPage(totalPages));
    }
  }, [contacts.length, currentPage, dispatch, totalPages]);

  useEffect(() => {
    if (selectedContact) {
      setDetailName(selectedContact.name || "");
      setDetailAbout(selectedContact.about || "");
    }
  }, [selectedContact]);

  useEffect(() => {
    setContactCallsPage(1);
  }, [selectedContactId]);

  useEffect(() => {
    if (handledLocationKeyRef.current === location.key) {
      return;
    }

    handledLocationKeyRef.current = location.key;

    const routeState = (location.state as {
      openAddContact?: boolean;
      prefillPhoneNumber?: string;
    } | null) || null;

    if (!routeState?.openAddContact) {
      return;
    }

    setIsAddDialogOpen(true);
    const rawPhone = String(routeState.prefillPhoneNumber || "").trim();
    const digits = rawPhone.replace(/\D/g, "");
    if (!digits) {
      return;
    }

    if (digits.startsWith("61")) {
      setSelectedCountryCode("+61");
      setCustomCountryCode("");
      setNewContactPhone(digits.slice(2).replace(/^0+/, ""));
      return;
    }

    setSelectedCountryCode("+61");
    setCustomCountryCode("");
    setNewContactPhone(digits.replace(/^0+/, ""));
  }, [location.key, location.state]);

  const formatDate = (value?: string) => {
    if (!value) return "Unknown date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleString();
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const handleAddContact = async () => {
    const name = newContactName.trim();
    const rawPhoneNumber = newContactPhone.trim();
    const about = newContactAbout.trim();
    const codeValue =
      selectedCountryCode === "custom"
        ? customCountryCode.trim()
        : selectedCountryCode;
    const normalizedCountryCode =
      codeValue && codeValue.startsWith("+")
        ? codeValue
        : codeValue
          ? `+${codeValue}`
          : "";
    const phoneNumber = `${normalizedCountryCode}${rawPhoneNumber}`.trim();

    if (!name || !rawPhoneNumber || !normalizedCountryCode) {
      return;
    }

    try {
      await dispatch(
        createContact({
          name,
          phoneNumber,
          about,
        }),
      ).unwrap();

      setNewContactName("");
      setSelectedCountryCode("+61");
      setCustomCountryCode("");
      setNewContactPhone("");
      setNewContactAbout("");
      setIsAddDialogOpen(false);
    } catch {
      // Error is stored in slice and rendered by existing error UI.
    }
  };

  const handleRowClick = (contactId: string) => {
    if (!contactId) {
      return;
    }
    dispatch(fetchContactDetail(contactId));
    navigate(`/dashboard/contacts/${encodeURIComponent(contactId)}`);
  };

  const handleBackToContacts = () => {
    dispatch(clearSelectedContact());
    navigate("/dashboard/contacts");
  };

  const handleSaveContact = async () => {
    if (!selectedContactId) {
      return;
    }

    const name = detailName.trim();
    if (!name) {
      return;
    }

    try {
      setIsSavingContact(true);
      await dispatch(
        updateContact({
          id: selectedContactId,
          name,
          about: detailAbout.trim() || undefined,
        }),
      ).unwrap();

      await dispatch(fetchContactDetail(selectedContactId));
    } finally {
      setIsSavingContact(false);
    }
  };

  const goToPage = (page: number) => {
    dispatch(setCurrentPage(Math.min(Math.max(1, page), totalPages)));
  };

  const hasContactEdits = (() => {
    if (!selectedContact) {
      return false;
    }

    const normalizedName = detailName.trim();
    const normalizedAbout = detailAbout.trim();
    const originalName = (selectedContact.name || "").trim();
    const originalAbout = (selectedContact.about || "").trim();

    return normalizedName !== originalName || normalizedAbout !== originalAbout;
  })();

  const openCallReview = (callHistoryItem: {
    id: string;
    summary?: string;
    direction?: string;
    durationSeconds?: number;
    createdAt?: string;
    endedReason?: string;
  }) => {
    const fullCall = callsById.get(String(callHistoryItem.id || "").trim());

    if (fullCall) {
      setSelectedReviewCall(fullCall);
      return;
    }

    setSelectedReviewCall({
      id: callHistoryItem.id,
      transcript: callHistoryItem.summary || "",
      endedReason: callHistoryItem.endedReason || callHistoryItem.summary || "",
      direction: callHistoryItem.direction,
      durationSeconds: callHistoryItem.durationSeconds,
      createdAt: callHistoryItem.createdAt,
      callerNumber: selectedContact?.phoneNumber,
      structuredOutputs: {
        "Call Summary": callHistoryItem.summary || "",
      },
    });
  };

  const contactCallsPerPage = CONTACT_CALLS_PER_PAGE;
  const selectedContactCallHistory = selectedContact?.callHistory || [];
  const totalContactCallPages = Math.max(
    1,
    Math.ceil(selectedContactCallHistory.length / contactCallsPerPage),
  );
  const paginatedContactCallHistory = selectedContactCallHistory.slice(
    (contactCallsPage - 1) * contactCallsPerPage,
    contactCallsPage * contactCallsPerPage,
  );

  const contactCallPageButtons = (() => {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, contactCallsPage - half);
    const end = Math.min(totalContactCallPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages: number[] = [];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  })();

  useEffect(() => {
    if (
      !selectedContact ||
      selectedContactCallHistory.length === 0 ||
      callsFetchStatus === "loading"
    ) {
      return;
    }

    const visibleCallIds = selectedContactCallHistory
      .slice(0, CONTACT_CALLS_PER_PAGE)
      .map((call) => String(call.id || "").trim())
      .filter(Boolean);

    const hasMissingVisibleCalls = visibleCallIds.some(
      (callId) => !callsById.has(callId),
    );
    const hydrationKey = `${selectedContact.id}:${visibleCallIds.join(",")}`;

    if (
      !hasMissingVisibleCalls ||
      attemptedCallHydrationKeysRef.current.has(hydrationKey)
    ) {
      return;
    }

    attemptedCallHydrationKeysRef.current.add(hydrationKey);
    dispatch(fetchCallsPage({ page: 1, limit: CONTACT_CALLS_PER_PAGE }));
  }, [
    callsById,
    callsFetchStatus,
    dispatch,
    selectedContact,
    selectedContactCallHistory,
  ]);

  const getDirectionBadge = (direction: string) => {
    if (direction === "inboundPhoneCall") {
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
          Incoming
        </Badge>
      );
    }

    if (direction === "outboundPhoneCall") {
      return (
        <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20">
          Outgoing
        </Badge>
      );
    }

    return <Badge variant="secondary">{direction || "Unknown"}</Badge>;
  };

  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case "inboundPhoneCall":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
            Incoming
          </Badge>
        );
      case "outboundPhoneCall":
        return (
          <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20">
            Outgoing
          </Badge>
        );
      case "General":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-200">
            General
          </Badge>
        );
      default:
        return <Badge variant="secondary">{intent}</Badge>;
    }
  };

  useEffect(() => {
    if (contactCallsPage > totalContactCallPages) {
      setContactCallsPage(totalContactCallPages);
    }
  }, [contactCallsPage, totalContactCallPages]);

  if (selectedContactId) {
    return (
      <>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-w-0 w-full max-w-6xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              className="mb-2 px-0"
              onClick={handleBackToContacts}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to contacts
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Contact Detail</h1>
            <p
              className="text-muted-foreground text-sm md:text-base mt-1"
            >
              View call history and edit contact details.
            </p>
          </div>
        </div>

        {(selectedContactStatus === "loading" || status === "loading") && !selectedContact && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading contact details...
          </div>
        )}

        {(selectedContactError || error) && (
          <Card className="mb-4">
            <CardContent className="py-4">
              <p className="text-sm text-red-500">{selectedContactError || error}</p>
            </CardContent>
          </Card>
        )}

        {selectedContact && (
          <div className="space-y-6">
            <Card className={""}>
              <CardHeader>
                <CardTitle>Edit Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="detail-name">Name</Label>
                  <Input
                    id="detail-name"
                    value={detailName}
                    onChange={(event) => setDetailName(event.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detail-phone">Phone Number</Label>
                  <Input id="detail-phone" value={selectedContact.phoneNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detail-about">About</Label>
                  <Textarea
                    id="detail-about"
                    value={detailAbout}
                    onChange={(event) => setDetailAbout(event.target.value)}
                    placeholder="Add context about this contact"
                  />
                </div>
                <Button
                  onClick={handleSaveContact}
                  disabled={isSavingContact || !detailName.trim() || !hasContactEdits}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingContact ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            <Card className={""}>
              <CardHeader>
                <CardTitle>Previous Call Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedContact.callHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No call history for this contact yet.
                  </p>
                ) : (
                  <div className="rounded-lg border border-border bg-card shadow-sm overflow-x-auto">
                    <Table className="min-w-max">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Datetime</TableHead>
                          <TableHead>Direction</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead className="w-[340px]">Call Summary</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedContactCallHistory.map((call) => (
                          <TableRow
                            key={call.id}
                            className="group cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => openCallReview(call)}
                          >
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(call.createdAt)}
                            </TableCell>
                            <TableCell>{getDirectionBadge(call.direction)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {Math.round(call.durationSeconds || 0)}s
                            </TableCell>
                            <TableCell className="max-w-[340px] truncate text-sm text-muted-foreground">
                              {call.summary?.trim() || "No summary available for this call."}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openCallReview(call);
                                }}
                              >
                                Review <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        Showing {(contactCallsPage - 1) * contactCallsPerPage + 1} to{" "}
                        {Math.min(
                          contactCallsPage * contactCallsPerPage,
                          selectedContactCallHistory.length,
                        )}{" "}
                        of {selectedContactCallHistory.length} calls
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setContactCallsPage((prev) => Math.max(1, prev - 1))}
                          disabled={contactCallsPage <= 1}
                        >
                          Previous
                        </Button>
                        {contactCallPageButtons.map((page) => (
                          <Button
                            key={page}
                            variant={page === contactCallsPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setContactCallsPage(page)}
                            className="min-w-9"
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setContactCallsPage((prev) =>
                              Math.min(totalContactCallPages, prev + 1),
                            )
                          }
                          disabled={contactCallsPage >= totalContactCallPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Sheet
        open={!!selectedReviewCall}
        onOpenChange={(open) => !open && setSelectedReviewCall(null)}
      >
        <SheetContent
          className="w-[400px] sm:w-[540px] overflow-y-auto bg-popover"
        >
          {selectedReviewCall && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>
                  Call Overview
                </SheetTitle>
                <SheetDescription>
                  Review the conversation details.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                <div
                  className="p-4 rounded-xl border border-border bg-muted/40"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground border border-border"
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {selectedContact?.name ||
                          selectedReviewCall.callerNumber ||
                          selectedContact?.phoneNumber ||
                          "Unknown Caller"}
                      </h3>
                      <p
                        className="text-xs text-muted-foreground"
                      >
                        {selectedReviewCall.callerNumber ||
                          selectedContact?.phoneNumber ||
                          "Unknown number"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {getIntentBadge(
                      selectedReviewCall.structuredOutputs?.["Call Intent"] ||
                        selectedReviewCall.direction ||
                        "General",
                    )}
                    <span
                      className="text-xs ml-auto text-muted-foreground"
                    >
                      {selectedReviewCall.createdAt
                        ? new Date(selectedReviewCall.createdAt).toLocaleString()
                        : "N/A"}{" "}
                      •{" "}
                      {selectedReviewCall.direction === "inboundPhoneCall"
                        ? "Incoming"
                        : "Outgoing"}{" "}
                      •{" "}
                      {selectedReviewCall.durationSeconds
                        ? formatDuration(
                            Math.round(selectedReviewCall.durationSeconds),
                          )
                        : "0s"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Extracted Insights
                  </h4>
                  <div className="flex flex-col gap-3">
                    {selectedReviewCall.structuredOutputs &&
                    Object.entries(selectedReviewCall.structuredOutputs).filter(
                      ([key]) =>
                        key.toLowerCase() !== "sms" &&
                        key.toLowerCase() !== "context",
                    ).length > 0 ? (
                      Object.entries(selectedReviewCall.structuredOutputs)
                        .filter(
                          ([key]) =>
                            key.toLowerCase() !== "sms" &&
                            key.toLowerCase() !== "context",
                        )
                        .map(([key, value], idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span
                              className="text-xs font-semibold text-foreground"
                            >
                              {key}
                            </span>
                            <div
                              className="p-3 rounded-lg text-sm border border-border bg-card text-card-foreground"
                            >
                              {String(value)}
                            </div>
                          </div>
                        ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No insights extracted
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="p-3 rounded-lg border border-border bg-card flex flex-col gap-2"
                >
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Play className="h-4 w-4" /> Call Recording
                  </h4>
                  {selectedReviewCall.recordingUrl ? (
                    <audio
                      controls
                      className="w-full h-10 mt-1"
                      src={selectedReviewCall.recordingUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <span className="text-xs text-muted-foreground mt-1">
                      No recording available for this call
                    </span>
                  )}
                  <span
                    className="text-xs ml-auto font-medium text-muted-foreground"
                  >
                    Duration:{" "}
                    {selectedReviewCall.durationSeconds
                      ? formatDuration(Math.round(selectedReviewCall.durationSeconds))
                      : "0s"}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Transcript</h4>
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border border-border bg-muted/40 text-foreground"
                  >
                    {selectedReviewCall.transcript ||
                      selectedReviewCall.structuredOutputs?.["Call Summary"] ||
                      selectedReviewCall.endedReason ||
                      "No transcript available."}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      </>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-w-0 w-full max-w-6xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p
            className="text-muted-foreground text-sm md:text-base mt-1"
          >
            Browse your contacts and open detail view for call history and edits.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={newContactName}
                onChange={(event) => setNewContactName(event.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <div className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-2">
                {selectedCountryCode === "custom" ? (
                  <Input
                    value={customCountryCode}
                    onChange={(event) =>
                      setCustomCountryCode(event.target.value)
                    }
                    onBlur={() => {
                      const value = customCountryCode.trim();
                      if (!value || value === "+61") {
                        setSelectedCountryCode("+61");
                        setCustomCountryCode("");
                      }
                    }}
                    placeholder="Country code (e.g. +1)"
                  />
                ) : (
                  <select
                    value={selectedCountryCode}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSelectedCountryCode(value);
                      if (value === "custom") {
                        setCustomCountryCode("");
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="+61">Australia (+61)</option>
                    <option value="custom">Custom</option>
                  </select>
                )}
                <Input
                  id="contact-phone"
                  value={newContactPhone}
                  onChange={(event) => setNewContactPhone(event.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-about">About</Label>
              <Textarea
                id="contact-about"
                value={newContactAbout}
                onChange={(event) => setNewContactAbout(event.target.value)}
                placeholder="Extra details AI should know about this contact..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              disabled={
                !newContactName.trim() ||
                !newContactPhone.trim() ||
                (selectedCountryCode === "custom" && !customCountryCode.trim())
              }
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading contacts...
        </div>
      )}

      {error && (
        <Card className="mb-4">
          <CardContent className="py-4">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {status !== "loading" && contacts.length === 0 && !error && (
        <Card className={""}>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No contacts found yet.
          </CardContent>
        </Card>
      )}

      {contacts.length > 0 && (
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Last Call</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact) => (
                <TableRow
                  key={contact.id || contact.phoneNumber}
                  className={
                    contact.id
                      ? "cursor-pointer group hover:bg-muted/50"
                      : "opacity-70"
                  }
                  onClick={() => handleRowClick(contact.id)}
                >
                  <TableCell className="font-medium">
                    {contact.name || "Unknown Contact"}
                  </TableCell>
                  <TableCell>{contact.phoneNumber || "Unknown number"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.lastCallAt ? formatDate(contact.lastCallAt) : "No calls yet"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Review <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + pageSize, contacts.length)} of {contacts.length} contacts
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </Button>
              {pageButtonNumbers.map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="min-w-9"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Clock,
  Timer,
  Hourglass,
  CalendarCheck,
  User,
  Play,
  FileText,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { fetchCallsPage } from "@/store/callsSlice";
import {
  fetchContactDetail,
  setSelectedContactId,
  type Contact,
} from "@/store/contactsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { normalizePhoneInternational, normalizePhoneLocal } from "@/lib/phone";

interface CallsSectionProps {
  isDark: boolean;
}

type CallRow = {
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

export function CallsSection({ isDark }: CallsSectionProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCall, setSelectedCall] = useState<CallRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  const calls = useAppSelector((state) => state.calls.calls);
  const callStats = useAppSelector((state) => state.calls.callStats);
  const fetchError = useAppSelector((state) => state.calls.fetchError);
  const contacts = useAppSelector((state) => state.contacts.contacts);
  const assistant = useAppSelector((state) => state.assistant.assistant);
  const totalCalls = Math.max(callStats?.totalCalls || 0, calls.length);
  const totalPages = Math.max(1, Math.ceil(totalCalls / itemsPerPage));
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

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
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage]);

  const user = useAppSelector(
    (state) =>
      state.auth.user as { name?: string; phoneNumber?: string } | null,
  );
  const status = useAppSelector((state) => state.auth.status);
  const isLoadingUser = status === "loading" && !user;
  const userName = user?.name || user?.phoneNumber || null;

  const contactsByPhone = useMemo(() => {
    const byPhone = new Map<string, Contact>();

    for (const contact of contacts) {
      const intl = normalizePhoneInternational(contact.phoneNumber);
      const local = normalizePhoneLocal(contact.phoneNumber);

      if (intl && !byPhone.has(intl)) {
        byPhone.set(intl, contact);
      }
      if (local && !byPhone.has(local)) {
        byPhone.set(local, contact);
      }
    }

    return byPhone;
  }, [contacts]);

  const getContactByCallerNumber = (callerNumber?: string) => {
    const intl = normalizePhoneInternational(callerNumber);
    if (intl && contactsByPhone.has(intl)) {
      return contactsByPhone.get(intl) || null;
    }

    const local = normalizePhoneLocal(callerNumber);
    if (local && contactsByPhone.has(local)) {
      return contactsByPhone.get(local) || null;
    }

    return null;
  };

  const selectedCallContact = selectedCall
    ? getContactByCallerNumber(selectedCall.callerNumber)
    : null;

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

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const loadCallsThroughPage = async (targetPage: number) => {
    const safeTargetPage = Math.min(Math.max(1, targetPage), totalPages);
    let loadedCount = calls.length;
    let nextPageToFetch = Math.floor(loadedCount / itemsPerPage) + 1;

    while (
      nextPageToFetch <= safeTargetPage &&
      loadedCount < totalCalls
    ) {
      await dispatch(
        fetchCallsPage({ page: nextPageToFetch, limit: itemsPerPage }),
      ).unwrap();

      loadedCount = Math.max(
        loadedCount,
        Math.min(nextPageToFetch * itemsPerPage, totalCalls),
      );
      nextPageToFetch += 1;
    }
  };

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) {
      return;
    }

    try {
      setIsLoadingNextPage(true);
      await loadCallsThroughPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch next calls page", error);
      return;
    } finally {
      setIsLoadingNextPage(false);
    }

    setCurrentPage(nextPage);
  };

  const handlePreviousPage = () => {
    if (!canGoPrevious) {
      return;
    }
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageSelect = async (page: number) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    if (safePage === currentPage) {
      return;
    }

    try {
      setIsLoadingNextPage(true);
      await loadCallsThroughPage(safePage);
    } catch (error) {
      console.error("Failed to fetch calls page", error);
      return;
    } finally {
      setIsLoadingNextPage(false);
    }

    setCurrentPage(safePage);
  };

  const handleRefreshCalls = async () => {
    if (isRefreshing || isLoadingNextPage) {
      return;
    }

    try {
      setIsRefreshing(true);
      await dispatch(fetchCallsPage({ page: 1, limit: itemsPerPage })).unwrap();
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to refresh calls", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactAction = async () => {
    if (!selectedCall) {
      return;
    }

    if (selectedCallContact?.id) {
      dispatch(setSelectedContactId(selectedCallContact.id));
      try {
        await dispatch(fetchContactDetail(selectedCallContact.id)).unwrap();
      } catch (error) {
        console.error("Failed to load contact detail", error);
      }
      setSelectedCall(null);
      navigate("/dashboard/contacts", {
        state: {
          activeTab: "Contacts",
        },
      });
      return;
    }

    setSelectedCall(null);
    navigate("/dashboard/contacts", {
      state: {
        activeTab: "Contacts",
        openAddContact: true,
        prefillPhoneNumber: selectedCall.callerNumber || "",
      },
    });
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 min-w-0 w-full max-w-7xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          {isLoadingUser ? (
            <div className="flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span>Loading profile...</span>
            </div>
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back{userName ? `, ${userName}` : ""}
            </h1>
          )}
          <p
            className="text-muted-foreground text-sm md:text-base"
          >
            Track and monitor all your prospect interactions in one place.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshCalls}
          disabled={isRefreshing || isLoadingNextPage}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <Card
          className={
            ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Calls
            </CardTitle>
            <Phone
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callStats?.totalCalls || 0}
            </div>
            <p
              className="text-xs mt-1 text-muted-foreground"
            >
              Lifetime calls
            </p>
          </CardContent>
        </Card>
        <Card
          className={
            ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Call Mins
            </CardTitle>
            <Clock
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((callStats?.totalDurationSecs || 0) / 60) < 1
                ? ">1m"
                : `~${Math.round((callStats?.totalDurationSecs || 0) / 60)}m`}
            </div>
            <p
              className="text-xs mt-1 text-muted-foreground"
            >
              Lifetime duration
            </p>
          </CardContent>
        </Card>
        <Card
          className={
            ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Duration
            </CardTitle>
            <Timer
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(callStats?.averageDurationSecs || 0)}
            </div>
            <p
              className="text-xs mt-1 text-muted-foreground"
            >
              Across all calls
            </p>
          </CardContent>
        </Card>
        <Card
          className={
            ""
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutes Left</CardTitle>
            <Hourglass
              className="h-4 w-4 text-muted-foreground"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assistant?.remainingMins || 0}m
            </div>
            <p
              className="text-xs mt-1 text-muted-foreground"
            >
              Available balance
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className="rounded-lg border border-border bg-card shadow-sm overflow-x-auto"
      >
        {fetchError && (
          <div className="px-4 py-3 border-b border-border text-sm text-red-500">
            {fetchError}
          </div>
        )}
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Datetime</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[300px]">Call Summary</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-muted-foreground"
                >
                  No calls right now.
                </TableCell>
              </TableRow>
            ) : (
              calls
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((call: CallRow) => {
                  const matchedContact = getContactByCallerNumber(call.callerNumber);

                  return (
                  <TableRow
                    key={call._id || call.id}
                    className="cursor-pointer group hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedCall(call)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {matchedContact?.name || call.callerNumber || "Unknown Caller"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {call.callerNumber || "Unknown number"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {call.createdAt
                        ? new Date(call.createdAt).toLocaleString()
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-sm">
                      {getIntentBadge(call.direction)}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate text-sm text-muted-foreground">
                      {call.structuredOutputs?.["Call Intent"] || "General"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {call.durationSeconds
                        ? formatDuration(Math.round(call.durationSeconds))
                        : "0s"}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                      {call.structuredOutputs?.["Call Summary"] ||
                        call.endedReason ||
                        "N/A"}
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
                  );
                })
            )}
          </TableBody>
        </Table>

        {calls.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCalls)} of {totalCalls}{" "}
              calls
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={!canGoPrevious || isLoadingNextPage}
              >
                Previous
              </Button>
              {pageButtonNumbers.map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageSelect(page)}
                  disabled={isLoadingNextPage}
                  className="min-w-9"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!canGoNext || isLoadingNextPage}
              >
                {isLoadingNextPage ? "Loading..." : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
      <Sheet
        open={!!selectedCall}
        onOpenChange={(open) => !open && setSelectedCall(null)}
      >
        <SheetContent
          className="w-[400px] sm:w-[540px] overflow-y-auto bg-popover"
        >
          {selectedCall && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>
                  Call Overview
                </SheetTitle>
                <SheetDescription>
                  Review the conversation details and open the linked contact.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Contact Card */}
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
                        {selectedCallContact?.name ||
                          selectedCall.callerNumber ||
                          "Unknown Caller"}
                      </h3>
                      <p
                        className="text-xs text-muted-foreground"
                      >
                        {selectedCall.callerNumber || "Unknown number"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {getIntentBadge(
                      selectedCall.structuredOutputs?.["Call Intent"] ||
                        "General",
                    )}
                    <span
                      className="text-xs ml-auto text-muted-foreground"
                    >
                      {selectedCall.createdAt
                        ? new Date(selectedCall.createdAt).toLocaleString()
                        : "N/A"}{" "}
                      •{" "}
                      {selectedCall.direction == "inboundPhoneCall"
                        ? "Incoming"
                        : "Outgoing"}{" "}
                      •{" "}
                      {selectedCall.durationSeconds
                        ? formatDuration(
                            Math.round(selectedCall.durationSeconds),
                          )
                        : "0s"}
                    </span>
                  </div>
                </div>

                {/* AI Extracted Tags */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Extracted Insights
                  </h4>
                  <div className="flex flex-col gap-3">
                    {selectedCall.structuredOutputs &&
                    Object.entries(selectedCall.structuredOutputs).filter(
                      ([key]) =>
                        key.toLowerCase() !== "sms" &&
                        key.toLowerCase() !== "context",
                    ).length > 0 ? (
                      Object.entries(selectedCall.structuredOutputs)
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

                {/* Audio Player placeholder */}
                <div
                  className="p-3 rounded-lg border border-border bg-card flex flex-col gap-2"
                >
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Play className="h-4 w-4" /> Call Recording
                  </h4>
                  {selectedCall.recordingUrl ? (
                    <audio
                      controls
                      className="w-full h-10 mt-1"
                      src={selectedCall.recordingUrl}
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
                    {selectedCall.durationSeconds
                      ? formatDuration(Math.round(selectedCall.durationSeconds))
                      : "0s"}
                  </span>
                </div>

                {/* Transcript */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">Transcript</h4>
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border border-border bg-muted/40 text-foreground"
                  >
                    {selectedCall.transcript || "No transcript available."}
                  </div>
                </div>

                {/* CRM Action */}
                <div className="pt-4 border-t border-border">
                  <Button className="w-full" onClick={handleContactAction}>
                    {selectedCallContact ? "View Contact" : "Add to Contacts"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

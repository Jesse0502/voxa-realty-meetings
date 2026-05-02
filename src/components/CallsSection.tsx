import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface CallsSectionProps {
  isDark: boolean;
}

export function CallsSection({ isDark }: CallsSectionProps) {
  const dispatch = useAppDispatch();
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const itemsPerPage = 50;

  const calls = useAppSelector((state) => state.calls.calls);
  const callStats = useAppSelector((state) => state.calls.callStats);
  const assistant = useAppSelector((state) => state.assistant.assistant);
  const totalCalls = Math.max(callStats?.totalCalls || 0, calls.length);
  const totalPages = Math.max(1, Math.ceil(totalCalls / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const user = useAppSelector(
    (state) =>
      state.auth.user as { name?: string; phoneNumber?: string } | null,
  );
  const status = useAppSelector((state) => state.auth.status);
  const isLoadingUser = status === "loading" && !user;
  const userName = user?.name || user?.phoneNumber || null;

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

  const handleNextPage = async () => {
    const nextPage = currentPage + 1;
    if (nextPage > totalPages) {
      return;
    }

    const requiredLoadedCount = nextPage * itemsPerPage;
    const shouldFetchPage = calls.length < requiredLoadedCount && calls.length < totalCalls;

    if (shouldFetchPage) {
      try {
        setIsLoadingNextPage(true);
        await dispatch(fetchCallsPage({ page: nextPage, limit: itemsPerPage })).unwrap();
      } catch (error) {
        console.error("Failed to fetch next calls page", error);
        return;
      } finally {
        setIsLoadingNextPage(false);
      }
    }

    setCurrentPage(nextPage);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 min-w-0 w-full max-w-7xl mx-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex flex-col gap-1 mb-8">
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
          className={`${isDark ? "text-gray-400" : "text-muted-foreground"} text-sm md:text-base`}
        >
          Track and monitor all your prospect interactions in one place.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card
          className={
            isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Number of Calls
            </CardTitle>
            <Phone
              className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callStats?.totalCalls || 0}
            </div>
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            >
              Lifetime calls
            </p>
          </CardContent>
        </Card>
        <Card
          className={
            isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Call Mins
            </CardTitle>
            <Clock
              className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((callStats?.totalDurationSecs || 0) / 60) < 1
                ? ">1m"
                : `~${Math.round((callStats?.totalDurationSecs || 0) / 60)}m`}
            </div>
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            >
              Lifetime duration
            </p>
          </CardContent>
        </Card>
        <Card
          className={
            isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Duration
            </CardTitle>
            <Timer
              className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(callStats?.averageDurationSecs || 0)}
            </div>
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            >
              Across all calls
            </p>
          </CardContent>
        </Card>
        <Card
          className={
            isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minutes Left</CardTitle>
            <Hourglass
              className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assistant?.remainingMins || 0}m
            </div>
            <p
              className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-muted-foreground"}`}
            >
              Available balance
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className={`rounded-lg border shadow-sm overflow-x-auto ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white"
        }`}
      >
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
                .map((call: any) => (
                  <TableRow
                    key={call._id || call.id}
                    className="cursor-pointer group hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedCall(call)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {call.callerNumber || "Unknown Caller"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {call.callerNumber}
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
                ))
            )}
          </TableBody>
        </Table>

        {calls.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCalls)} of{" "}
              {totalCalls} calls
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isLoadingNextPage}
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
          className={`w-[400px] sm:w-[540px] overflow-y-auto ${isDark ? "bg-gray-900 border-gray-800 text-white" : ""}`}
        >
          {selectedCall && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className={isDark ? "text-gray-100" : ""}>
                  Call Overview
                </SheetTitle>
                <SheetDescription className={isDark ? "text-gray-400" : ""}>
                  Review the conversation details and push to your CRM.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Contact Card */}
                <div
                  className={`p-4 rounded-xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${isDark ? "bg-gray-700 text-gray-300" : "bg-white border shadow-sm text-gray-600"}`}
                    >
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {selectedCall.callerNumber || "Unknown Caller"}
                      </h3>
                      <p
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {selectedCall.callerNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {getIntentBadge(
                      selectedCall.structuredOutputs?.["Call Intent"] ||
                        "General",
                    )}
                    <span
                      className={`text-xs ml-auto ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
                    Object.keys(selectedCall.structuredOutputs).length > 0 ? (
                      Object.entries(selectedCall.structuredOutputs).map(
                        ([key, value], idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span
                              className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {key}
                            </span>
                            <div
                              className={`p-3 rounded-lg text-sm border ${isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-700"}`}
                            >
                              {String(value)}
                            </div>
                          </div>
                        ),
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No insights extracted
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Player placeholder */}
                <div
                  className={`p-3 rounded-lg border flex flex-col gap-2 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}
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
                    className={`text-xs ml-auto font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}
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
                    className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border ${isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 text-gray-700"}`}
                  >
                    {selectedCall.transcript || "No transcript available."}
                  </div>
                </div>

                {/* CRM Action */}
                <div className="pt-4 border-t border-border">
                  <Button className="w-full">
                    Push to CRM (Follow Up Boss)
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

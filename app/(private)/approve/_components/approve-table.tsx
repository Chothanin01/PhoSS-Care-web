"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { CircleX, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils"
import { Separator } from "@/shadcn/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription  } from "@/shadcn/ui/dialog"
import { Textarea } from "@/shadcn/ui/textarea";
import Cookies from "js-cookie";

interface Request {
  id: string;
  reqType: string;
  patientName: string;
  firstName: string
  lastName: string
  diseaseName: string;
  hnNumber: string;
  status: RequestStatus;
}

enum RequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

const statusDisplayMap = {
  pending: "กำลังรอพิจารณา",
  accepted: "อนุมัติคำขอ",
  declined: "ยกเลิกคำขอ",
}

export function SortTableRequest() {

  const [currentPage, setCurrentPage] = useState(1)

  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)

  const [declineReason, setDeclineReason] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requestDetail, setRequestDetail] = useState<any>(null)
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const [totalPages, setTotalPages] = useState(1)

  const itemsPerPage = 10
  
  const requestStatusOptions = [
    { value: "pending", label: "กำลังรอพิจารณา" },
    { value: "accepted", label: "อนุมัติคำขอ" },
    { value: "declined", label: "ยกเลิกคำขอ" },
  ]

  const requestTypeDisplayMap: Record<string, string> = {
    appoint: "เลื่อนนัด",
    medical: "ใบรับรองแพทย์",
    document: "ใบรับรองเอกสาร",
  }

  const requestTypeOptions = [
    { label: "เลื่อนนัด", value: "appoint" },
    { label: "ใบรับรองแพทย์", value: "medical" },
    { label: "ใบรับรองเอกสาร", value: "document" },
  ]

  const formatIdCard = (id?: string) => {
    if (!id) return "-"

    return id.replace(
      /^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/,
      "$1-$2-$3-$4-$5"
    )
  }

  const getStatusColor = (status: string) => {
    switch(status){

      case "pending":
        return "bg-yellow-100 text-yellow-700"

      case "accepted":
        return "bg-green-100 text-green-700"

      case "declined":
        return "bg-red-100 text-red-700"

      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [currentPage, filterType, filterStatus])

  const fetchRequests = async () => {
    try {

      setLoading(true)

      const params = new URLSearchParams()

      params.append("page", currentPage.toString())
      params.append("limit", itemsPerPage.toString())

      if (filterType) {
        params.append("req_type", filterType)
      }

      if (filterStatus) {
        params.append("status", filterStatus)
      }

      const token = Cookies.get("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/requests?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      const mapped = (data.data.data || []).map((r: any) => {
        const nameParts = (r.patient_name || "").split(" ")

        return {
          id: r.id,
          reqType: r.req_type,
          patientName: r.patient_name,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          diseaseName: r.disease_name,
          hnNumber: r.hn_number,
          status: r.status
        }
      })

      setRequests(mapped)
      setTotalPages(data.data.total_pages)

    } catch (err) {

      console.error("fetch request error", err)

    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const confirmApprove = async (requestId: string) => {

    const token = Cookies.get("token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/requests/${requestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "accepted"
        }),
      }
    )

    setIsModalOpen(false)
    fetchRequests()
  }

  const confirmDecline = async () => {

    const token = Cookies.get("token");

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/requests/${requestDetail.request_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "declined",
          description: declineReason
        }),
      }
    )

    setDeclineReason("")
    setIsDeclineModalOpen(false)
    fetchRequests()
  }

  const fetchRequestDetail = async (id: string) => {
    const token = Cookies.get("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/requests/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await res.json()

    setRequestDetail(data.data)
    setIsModalOpen(true)
  }

  const formatThaiDate = (dateStr?: string) => {
    if (!dateStr) return "-"

    const date = new Date(dateStr)

    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const RequestColumn = [

    {
      id: "reqType",
      header: "คำขอ",
      cell: (row: Request) => (
        <div className="text-xs whitespace-nowrap">
          {requestTypeDisplayMap[row.reqType] || row.reqType}
        </div>
      ),
    },

    {
      id: "patientName",
      header: "ชื่อ",
      cell: (row: Request) => (
        <div className="text-xs whitespace-nowrap">
          {row.firstName} <span className="ml-4">{row.lastName}</span>
        </div>
      ),
    },

    {
      id: "diseaseName",
      header: "โรค",
      cell: (row: Request) => (
        <div className="text-xs whitespace-nowrap">
          {row.diseaseName || "-"}
        </div>
      ),
    },

    {
      id: "hnNumber",
      header: "HN",
      cell: (row: Request) => (
        <div className="text-xs whitespace-nowrap">
          {row.hnNumber}
        </div>
      ),
    },

    {
      id: "status",
      header: "สถานะ",
      cell: (row: Request) => (
        <div className="flex justify-center">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              getStatusColor(row.status)
            )}
          >
            {statusDisplayMap[row.status]}
          </span>
        </div>
      ),
    }
  ]

  return (
    <div className="w-full">

      <div className="mb-6 flex flex-col md:flex-row gap-3 items-center">

        <div className="w-full md:w-2/12">
          <SelectField
            id="req_type"
            name="req_type"
            label=""
            placeholder="คำขอทั้งหมด"
            options={requestTypeOptions}
            value={filterType}
            onValueChange={(value) => setFilterType(value)}
          />
        </div>

        <div className="w-full md:w-2/12">
          <SelectField
            id="status"
            name="status"
            label=""
            placeholder="สถานะทั้งหมด"
            options={requestStatusOptions}
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
          />
        </div>

      </div>

      <DataTable<Request>
        data={requests}
        columns={RequestColumn}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={() => {}}
        currentSortBy=""
        currentSortOrder="asc"
        onRowClick={(row) => fetchRequestDetail(row.id)}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {requestTypeDisplayMap[requestDetail?.request_type] || requestDetail?.request_type}
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full font-semibold mr-4",
                  getStatusColor(requestDetail?.status)
                )}
              >
                {statusDisplayMap[requestDetail?.status as RequestStatus]}
              </span>
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <DialogDescription/>

          {requestDetail?.request_type === "appoint" && (
            <div className="font-medium">
              เลื่อนนัดเป็นวันที่ {formatThaiDate(requestDetail?.date)} เวลา {requestDetail?.start_time} - {requestDetail?.end_time} น.
            </div>
          )}

          <div className="grid grid-cols-12 gap-3 text-sm">
            <div className="col-span-5">{requestDetail?.fullname}</div>
            <div className="col-span-4">{formatIdCard(requestDetail?.id_card)}</div>
            <div className="col-span-3">HN {requestDetail?.hn_number}</div>
            <div className="col-span-12">{requestDetail?.disease_name}</div>
            {requestDetail?.request_type === "appoint" && (
              <div className="col-span-12">
                นัดก่อนเลื่อน : {formatThaiDate(requestDetail?.appoint_date)} เวลา {requestDetail?.appoint_start_time} - {requestDetail?.appoint_end_time} น.
              </div>
            )}
            {requestDetail?.status === RequestStatus.DECLINED && requestDetail?.description && (
              <div className="col-span-12">
                เหตุผลที่ยกเลิกคำขอ : {requestDetail.description}
              </div>
            )}
            {requestDetail?.request_type === "medical" && (
              <div className="col-span-12">
                แพทย์ : {requestDetail?.doctor || "-"}
              </div>
            )}
            {(requestDetail?.request_type === "medical" || requestDetail?.request_type === "document") && (
              <>
                <div className="col-span-12">
                  รายละเอียด : {requestDetail?.description || "-"}
                </div>
              </>
            )}
              {requestDetail?.request_type === "medical" && (
              <div className="col-span-12">
                วันที่ {formatThaiDate(requestDetail?.created_date || "-")}
              </div>
            )}
          </div>

          {requestDetail?.status === RequestStatus.PENDING && (
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => {
                  setSelectedRequest(requestDetail)
                  setIsModalOpen(false)

                  setTimeout(() => {
                    setIsDeclineModalOpen(true)
                  }, 100)
                }}
                className="bg-Bamboo-200 text-red-500 border-2 border-red-500 font-medium hover:bg-gray-200 w-40"
              >
                <CircleX className="w-4 h-4 mr-2"/> 
                ปฏิเสธคำขอ
              </Button>

              <Button
                onClick={() => confirmApprove(requestDetail.request_id)}
                className="bg-Bamboo-200 text-Bamboo-100 border-2 border-Bamboo-100 font-medium hover:bg-gray-200 w-40"
              >
                <BadgeCheck className="w-4 h-4 mr-2"/>
                อนุมัติคำขอ
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeclineModalOpen} onOpenChange={setIsDeclineModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {requestTypeDisplayMap[requestDetail?.request_type] || requestDetail?.request_type}
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full font-semibold mr-4",
                  getStatusColor(requestDetail?.status)
                )}
              >
                {statusDisplayMap[requestDetail?.status]}
              </span>
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <DialogDescription/>

          <div className="font-medium">เลื่อนนัดเป็นวันที่ {formatThaiDate(requestDetail?.date)} เวลา {requestDetail?.start_time} - {requestDetail?.end_time} น.</div>

          <div className="grid grid-cols-12 gap-3 text-sm">
            <div className="col-span-5">{requestDetail?.fullname}</div>
            <div className="col-span-4">{formatIdCard(requestDetail?.id_card)}</div>
            <div className="col-span-3">HN {requestDetail?.hn_number}</div>
            <div className="col-span-12">{requestDetail?.disease_name}</div>
            {requestDetail?.request_type === "appoint" && (
              <div className="col-span-12">
                นัดก่อนเลื่อน : {formatThaiDate(requestDetail?.appoint_date)} เวลา {requestDetail?.appoint_start_time} - {requestDetail?.appoint_end_time} น.
              </div>
            )}
            {requestDetail?.request_type === "medical" && (
              <div className="col-span-12">
                แพทย์ : {requestDetail?.doctor || "-"}
              </div>
            )}
            {(requestDetail?.request_type === "medical" || requestDetail?.request_type === "document") && (
              <>
                <div className="col-span-12">
                  รายละเอียด : {requestDetail?.description || "-"}
                </div>
              </>
            )}
            {requestDetail?.request_type === "medical" && (
              <div className="col-span-12">
                วันที่ {formatThaiDate(requestDetail?.created_date || "-")}
              </div>
            )}
          </div>

          <div className="mt-4">ระบุเหตุผลในการปฏิเสธ <span className="text-red-500">*</span></div>
          <Textarea
            className="w-full border-red-500 rounded-md p-2 text-sm"
            rows={4}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
            <Button
              disabled={!declineReason.trim()}
              className={cn(
                "text-white",
                declineReason.trim()
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-300 cursor-not-allowed"
              )}
              onClick={confirmDecline}
            >
              ยืนยันการปฏิเสธ
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
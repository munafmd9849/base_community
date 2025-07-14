import React, { useState } from "react";
import { Certificate } from "@/entities/Certificate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Award,
  Download,
  Mail,
  Plus,
  Edit,
  FileText,
  Trophy,
  Calendar,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const certificateTypes = ["Class Completion", "Contest Winner", "Course Completion", "Achievement"];

export default function CertificateGenerator({ certificates, members, classes, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCertificate, setPreviewCertificate] = useState(null);
  
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    classId: "",
    className: "",
    score: 0,
    completionDate: "",
    instructorName: "",
    instructorSignature: "",
    certificateType: "Class Completion"
  });

  const resetForm = () => {
    setFormData({
      memberId: "",
      memberName: "",
      classId: "",
      className: "",
      score: 0,
      completionDate: new Date().toISOString().split('T')[0],
      instructorName: "",
      instructorSignature: "",
      certificateType: "Class Completion"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Auto-fill member and class names if IDs are provided
      if (formData.memberId && !formData.memberName) {
        const member = members.find(m => m.id === formData.memberId);
        formData.memberName = member?.name || "";
      }
      
      if (formData.classId && !formData.className) {
        const classItem = classes.find(c => c.id === formData.classId);
        formData.className = classItem?.className || "";
      }

      if (editingCertificate) {
        await Certificate.update(editingCertificate.id, formData);
      } else {
        await Certificate.create(formData);
      }
      setIsModalOpen(false);
      setEditingCertificate(null);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error("Error saving certificate:", error);
    }
  };

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate);
    setFormData({ ...certificate });
    setIsModalOpen(true);
  };

  const generateCertificatePDF = async (certificate) => {
    // This would integrate with PDF generation library
    alert(`Generating PDF certificate for ${certificate.memberName}...`);
    
    // Simulate PDF generation
    const updatedCertificate = {
      ...certificate,
      isIssued: true,
      certificateUrl: `https://certificates.example.com/${certificate.id}.pdf`
    };
    
    await Certificate.update(certificate.id, updatedCertificate);
    onRefresh();
  };

  const previewCertificateDesign = (certificate) => {
    setPreviewCertificate(certificate);
    setIsPreviewOpen(true);
  };

  const sendCertificateEmail = async (certificate) => {
    const member = members.find(m => m.id === certificate.memberId);
    if (member) {
      alert(`Sending certificate to ${member.email}...`);
      // This would integrate with email service
    }
  };

  const bulkGenerateCertificates = async () => {
    const pendingCertificates = certificates.filter(cert => !cert.isIssued);
    
    if (pendingCertificates.length === 0) {
      alert("No pending certificates to generate");
      return;
    }

    if (window.confirm(`Generate ${pendingCertificates.length} certificates?`)) {
      for (const cert of pendingCertificates) {
        await generateCertificatePDF(cert);
      }
      alert(`Generated ${pendingCertificates.length} certificates successfully!`);
    }
  };

  const getCertificateTypeColor = (type) => {
    const colors = {
      "Class Completion": "bg-blue-100 text-blue-800",
      "Contest Winner": "bg-yellow-100 text-yellow-800",
      "Course Completion": "bg-green-100 text-green-800",
      "Achievement": "bg-purple-100 text-purple-800"
    };
    return colors[type] || colors["Achievement"];
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Certificate Management</h2>
              <p className="text-sm text-slate-600">Generate and manage course completion certificates</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={bulkGenerateCertificates}>
                <FileText className="w-4 h-4 mr-2" />
                Bulk Generate
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    New Certificate
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingCertificate ? 'Edit Certificate' : 'Create New Certificate'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberId">Member *</Label>
                        <Select value={formData.memberId} onValueChange={(value) => {
                          const member = members.find(m => m.id === value);
                          setFormData({...formData, memberId: value, memberName: member?.name || ""});
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select member" />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map(member => (
                              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classId">Class/Contest *</Label>
                        <Select value={formData.classId} onValueChange={(value) => {
                          const classItem = classes.find(c => c.id === value);
                          setFormData({...formData, classId: value, className: classItem?.className || ""});
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map(cls => (
                              <SelectItem key={cls.id} value={cls.id}>{cls.className}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="certificateType">Certificate Type *</Label>
                        <Select value={formData.certificateType} onValueChange={(value) => setFormData({...formData, certificateType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {certificateTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="completionDate">Completion Date *</Label>
                        <Input
                          id="completionDate"
                          type="date"
                          value={formData.completionDate}
                          onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="score">Score (Optional)</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          value={formData.score}
                          onChange={(e) => setFormData({...formData, score: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructorName">Instructor Name</Label>
                        <Input
                          id="instructorName"
                          value={formData.instructorName}
                          onChange={(e) => setFormData({...formData, instructorName: e.target.value})}
                          placeholder="Name of the instructor"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructorSignature">Instructor Signature (Image URL)</Label>
                      <Input
                        id="instructorSignature"
                        value={formData.instructorSignature}
                        onChange={(e) => setFormData({...formData, instructorSignature: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingCertificate ? 'Update Certificate' : 'Create Certificate'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Certificates ({certificates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No certificates created</h3>
              <p className="text-slate-600 mb-4">Create your first certificate to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Class/Contest</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((certificate) => {
                    const member = members.find(m => m.id === certificate.memberId);
                    return (
                      <TableRow key={certificate.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <div>
                              <div className="font-medium">{certificate.memberName}</div>
                              <div className="text-sm text-slate-500">{member?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{certificate.className}</div>
                            {certificate.score > 0 && (
                              <div className="text-sm text-green-600">Score: {certificate.score}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCertificateTypeColor(certificate.certificateType)}>
                            {certificate.certificateType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            {format(new Date(certificate.completionDate), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={certificate.isIssued ? "default" : "secondary"}>
                            {certificate.isIssued ? "Issued" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => previewCertificateDesign(certificate)}
                              title="Preview Certificate"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            {!certificate.isIssued && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => generateCertificatePDF(certificate)}
                                title="Generate PDF"
                              >
                                <Download className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {certificate.isIssued && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => sendCertificateEmail(certificate)}
                                title="Send Email"
                              >
                                <Mail className="w-4 h-4 text-blue-600" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(certificate)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
          </DialogHeader>
          {previewCertificate && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg border-4 border-yellow-400">
              <div className="text-center space-y-6">
                <div className="text-4xl">🏆</div>
                <h1 className="text-3xl font-bold text-slate-900">Certificate of {previewCertificate.certificateType}</h1>
                <div className="text-lg text-slate-700">
                  This is to certify that
                </div>
                <div className="text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 inline-block">
                  {previewCertificate.memberName}
                </div>
                <div className="text-lg text-slate-700">
                  has successfully completed
                </div>
                <div className="text-xl font-semibold text-slate-900">
                  {previewCertificate.className}
                </div>
                {previewCertificate.score > 0 && (
                  <div className="text-lg text-green-600">
                    with a score of <strong>{previewCertificate.score}</strong>
                  </div>
                )}
                <div className="flex justify-between items-end mt-12">
                  <div>
                    <div className="text-sm text-slate-600">Date of Completion</div>
                    <div className="font-medium">{format(new Date(previewCertificate.completionDate), 'MMMM d, yyyy')}</div>
                  </div>
                  <div className="text-right">
                    {previewCertificate.instructorName && (
                      <>
                        <div className="w-32 border-b border-slate-400 mb-2"></div>
                        <div className="text-sm text-slate-600">{previewCertificate.instructorName}</div>
                        <div className="text-xs text-slate-500">Instructor</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
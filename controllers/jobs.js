const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, total: jobs.length })
}
const getJob = async (req, res) => {
  const jobId = req.params.id
  const userId = req.user.id
  const job = await Job.findOne({ createdBy: userId, _id: jobId })
  if (!job) {
    throw new NotFoundError(`cant find job with id: ${jobId}`)
  }
  res.status(200).json({ job })
}
const createJob = async (req, res) => {
  req.body.createdBy = req.user.id
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
  const jobId = req.params.id
  const userId = req.user.id
  const { company, position } = req.body

  if (company === '' || position === '') {
    throw new BadRequestError('please provide company and position')
  }

  const updatedJob = await Job.findByIdAndUpdate({ _id: jobId, createdBy: userId }, { company: company, position: position }, { new: true, runValidators: true })
  if (!updatedJob) {
    throw new NotFoundError(`cant find job with id: ${jobId}`)
  }
  res.status(200).json({ updatedJob })
}
const deleteJob = async (req, res) => {
  const jobId = req.params.id
  const userId = req.user.id

  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`cant find job with id: ${jobId}`)
  }
  res.status(200).json({ job })
}


module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
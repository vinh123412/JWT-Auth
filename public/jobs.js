import handleTokenExpiry from "./refresh-token.js"

document.addEventListener('DOMContentLoaded', async () => {
  const userInfoElement = document.getElementById('userInfo');
  const jobsListElement = document.getElementById('jobsList');
  const createJobForm = document.getElementById('createJobForm');
  let accessToken = await handleTokenExpiry();
  const userName = localStorage.getItem('userName');

  // display user name
  userInfoElement.textContent = `Welcome, ${userName}!`;
  console.log(localStorage)

  // Function redirect to edit job
  const redirectToUpdatePage = (jobId) => {
    window.location.href = `/edit-Job.html?id=${jobId}`;
  };

  //Delete job function
  const deleteJob = async (jobId) => {
    const deleteResponse = await fetch(`/api/v1/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (deleteResponse.ok) {
      const jobElement = document.getElementById(`job-${jobId}`)
      if (jobElement) {
        jobElement.remove();
      }
    } else {
      console.log('Failed to delete job');
    }
  };


  //display all jobs
  const jobResponse = await fetch('/api/v1/jobs', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (jobResponse.ok) {
    const jobsData = await jobResponse.json();
    const allJobs = jobsData.jobs;
    allJobs.forEach((job) => {
      const jobItem = document.createElement('div');
      jobItem.classList.add("jobster");
      jobItem.id = `job-${job._id}`;
      jobItem.innerHTML =
        `
        <p>company: ${job.company}</p>
        <p>position: ${job.position}</p>
        <p>status: ${job.status}</p>
        <button class="update-btn" data-jobid="${job._id}">Update</button>
        <button class="delete-btn" data-jobid="${job._id}">Delete</button>
        `
      jobsListElement.appendChild(jobItem);
    });


    // Add event listener for update and delete buttons
    jobsListElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('update-btn')) {
        const jobId = e.target.dataset.jobid;
        redirectToUpdatePage(jobId);
      }
      else if (e.target.classList.contains('delete-btn')) {
        const jobId = e.target.dataset.jobid;
        deleteJob(jobId);
      }
    });
  }



  //Create Job
  createJobForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const status = document.getElementById('status').value;

    const createResponse = await fetch('/api/v1/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ company, position, status })
    })

    if (createResponse.ok) {
      const newJobData = await createResponse.json();
      const job = newJobData.job
      const jobItem = document.createElement('div');
      jobItem.classList.add("jobster");
      jobItem.id = `job-${job._id}`;
      jobItem.innerHTML =
        `
      <p>company: ${job.company}</p>
      <p>position: ${job.position}</p>
      <p>status: ${job.status}</p>
      <button class="update-btn" data-jobid="${job._id}">Update</button>
      <button class="delete-btn" data-jobid="${job._id}">Delete</button>
      `;
      jobsListElement.appendChild(jobItem);
      createJobForm.reset();
    } else {
      console.error('Job creation failed');
    }

  });

});
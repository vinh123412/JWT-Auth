import handleTokenExpiry from "./refresh-token.js"

document.addEventListener('DOMContentLoaded', async () => {
  const oldJob = document.querySelector('.old-job');
  const updateJob = document.getElementById('updateJobBtn');
  let accessToken = await handleTokenExpiry();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');


  //Get job
  const response = await fetch(`/api/v1/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (response.ok) {
    const jobData = await response.json();
    const job = jobData.job;
    const jobItem = document.createElement('div');
    jobItem.innerHTML = `
    <p>company: ${job.company}</p>
    <p>position: ${job.position}</p>
    <p>status: ${job.status}</p>
    `
    oldJob.appendChild(jobItem);
  } else {
    console.error('Failed to fetch job data');
  }

  //Update job
  updateJob.addEventListener('click', async () => {
    const updatedCompany = document.getElementById('company').value;
    const updatedPosition = document.getElementById('position').value;

    const updateResponse = await fetch(`/api/v1/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ company: updatedCompany, position: updatedPosition })
    });

    if (updateResponse.ok) {
      console.log('Job updated successfully');
      window.location.href = 'jobs.html'
      // Redirect to jobs list page or display a success message
    } else {
      console.error('Failed to update job');
    }

  });

});
import signal
import asyncio

from black.workers.common.task import Task


class NmapTask(Task):

    def __init__(self, process_id, command):
        Task.__init__(self.process, process_id, command)

        self.proc = None
        self.status = "New"

        self.exit_code = None
        self.stdout = []
        self.stderr = []

    async def start(self):
        """ Launch the task """
        self.proc = await asyncio.create_subprocess_exec(*self.command)
        self.status = "Working"

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """        
        if command == 'pause':
            self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        elif command == 'stop':
            self.proc.terminate()  # SIGTERM
        elif command == 'unpause':
            self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    async def check_if_exited(self):
        """ Check if the process exited. If so, 
        save stdout, stderr, exit_code and update the status. """
        try:
            # Give 0.1s for a check that a process has exited
            (stdout, stderr) = await asyncio.wait_for(self.proc.communicate(), 0.1)
        except TimeoutError as _:
            # Not yet finished
            return False
        else:
            # The process have exited.
            # Save the data locally.]
            print("The process finished OK")
            self.stdout = stdout
            self.stderr = stderr
            self.exit_code = await self.proc.wait()

            if self.exit_code == 0:
                self.status = "Finished"
            else:
                self.status = "Aborted"

            return True

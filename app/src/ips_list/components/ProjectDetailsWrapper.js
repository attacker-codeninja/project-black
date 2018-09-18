import _ from 'lodash'
import { connect } from 'react-redux'

import ProjectDetailsFilters from './ProjectDetailsFilters.jsx'
import { updateComment as updateProjectComment } from '../../redux/projects/actions'
import { updateComment as updateScopeComment } from '../../redux/scopes/actions'
import { updateFilters } from '../../redux/filters/actions'


function mapStateToProps(state, ownProps) {
    let project_uuid = ownProps.project_uuid;
    let filtered_projects = _.filter(state.projects, (x) => {
        return x.project_uuid == project_uuid
    });

    let project = null;

    if (filtered_projects.length) {
        project = filtered_projects[0]
    } else {
        project = {
            "project_name": null,
            "project_uuid": null,
            "comment": ""
        }
    }

    let creds_dict = {};

    for (let cred of _.get(state.creds, "current_values", [])) {
        if (creds_dict.hasOwnProperty(cred.target)) {
            creds_dict[cred.target].push(cred);
        }
        else {
            creds_dict[cred.target] = [cred];
        }
    }

    let ips = JSON.parse(JSON.stringify(state.ips));

    if (ips) {
        for (var ip of ips.data) {
            ip.creds = [];

            if (creds_dict.hasOwnProperty(ip.ip_address)) {
                ip.creds = creds_dict[ip.ip_address];
            }

            ip.tasks = {
                "active": [],
                "finished": []
            };

            for (var task_raw of state.tasks.active) {
                if (task_raw.task_type == 'masscan') {
                    let task_splitted = task_raw.target;

                    if (task_splitted.indexOf(ip.ip_address) !== -1) {
                        ip.tasks.active.push(task_raw);
                    }
                }
                else if (task_raw.task_type == 'nmap') {
                    if (task_raw.target == ip.ip_address) {
                        ip.tasks.active.push(task_raw);
                    }
                }
                else if (task_raw.task_type == 'dirsearch') {
                    let task_splitted = task_raw.target.split(':');

                    if (task_splitted.indexOf(ip.ip_address) !== -1) {
                        ip.tasks.active.push(task_raw);
                    }                    
                }
            }

            for (var task_raw of state.tasks.finished) {
                if (task_raw.task_type == 'masscan') {
                    let task_splitted = task_raw.target;

                    if (task_splitted.indexOf(ip.ip_address) !== -1) {
                        ip.tasks.finished.push(task_raw);
                    }
                }
                else if (task_raw.task_type == 'nmap') {
                    if (task_raw.target == ip.ip_address) {
                        ip.tasks.finished.push(task_raw);
                    }
                }                
                else if (task_raw.task_type == 'dirsearch') {
                    let task_splitted = task_raw.target.split(':');

                    if (task_splitted.indexOf(ip.ip_address) !== -1) {
                        ip.tasks.finished.push(task_raw);
                    }                    
                }
            }            
        }
    }

    return {
        project: project,
        tasks: state.tasks,
        ips: ips,
        tasks: state.tasks.active,
        scans: state.scans
    }
}


const ProjectDetailsWrapper = connect(
    mapStateToProps
)(ProjectDetailsFilters)

export default ProjectDetailsWrapper
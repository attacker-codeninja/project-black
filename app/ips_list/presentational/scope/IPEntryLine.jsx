import React from 'react'
import { 
	Button, 
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardText,
	CardTitle,
	Col,
	ListGroup,
	ListGroupItem,
	Row
} from 'reactstrap'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'


class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const header = (
			<div className="d-flex justify-content-between">
				<div className="align-self-center"><b>{this.props.ip.ip_address}</b></div>

				<div>
		            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
						<Button outline size="sm">
							Verbose
						</Button>
		            </a>

					<Button outline color="danger" size="sm" onClick={this.props.deleteScope}>
						Delete
					</Button>
				</div>
			</div>
		);

		const ports = _.map(this.props.ip.scans.sort((a, b) => {
			if (a["port_number"] > b["port_number"]) return 1;
			if (a["port_number"] < b["port_number"]) return -1;
			return 0;
		}), (x) => {
			return (
				<ListGroupItem key={x.scan_id + '_' + x.port_number}>
					<Row>
						<Col md={1}>{x.port_number}</Col>
						<Col md={1}>{x.protocol}</Col>
						<Col md={10}>{x.banner}</Col>
					</Row>
				</ListGroupItem>
			)
		});


		return (
			<div>
				<Card>
					<CardHeader color="primary">{header}</CardHeader>
					<CardBody>
							<ScopeComment comment={this.props.ip.comment}
										  onCommentSubmit={this.props.onCommentSubmit} />
					</CardBody>
					<ListGroup className="list-group-flush">
						{ports}
					</ListGroup>
				</Card>
			</div>
		)	
	}
}

export default IPEntryLine;
